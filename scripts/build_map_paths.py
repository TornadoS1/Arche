"""Build simplified SVG path data for the map graphics from Natural Earth GeoJSON.

Natural Earth data is public domain (https://www.naturalearthdata.com/).
Download the 1:10m files from
https://github.com/nvkelso/natural-earth-vector/tree/master/geojson
and run:

    python scripts/build_map_paths.py <ne_10m_land.geojson> <ne_10m_bathymetry_K_200.geojson> <out.json> \
        --bbox 104 -13 142 7 --width 320

The output JSON holds the viewBox size and two SVG path strings: "land" and
"deep" (sea deeper than 200 m). Everything else is shallow shelf sea.
Projection: plate carree (fine near the equator).
"""

import argparse
import json


def ring_bbox(ring):
    xs = [p[0] for p in ring]
    ys = [p[1] for p in ring]
    return min(xs), min(ys), max(xs), max(ys)


def dp_simplify(points, tol):
    """Douglas-Peucker on a list of (x, y)."""
    if len(points) < 3:
        return points
    keep = [False] * len(points)
    keep[0] = keep[-1] = True
    stack = [(0, len(points) - 1)]
    while stack:
        a, b = stack.pop()
        ax, ay = points[a]
        bx, by = points[b]
        dx, dy = bx - ax, by - ay
        norm = (dx * dx + dy * dy) ** 0.5
        best, idx = 0.0, -1
        for i in range(a + 1, b):
            px, py = points[i]
            if norm == 0:  # closed ring: start == end, use distance to that point
                d = ((px - ax) ** 2 + (py - ay) ** 2) ** 0.5
            else:
                d = abs(dy * px - dx * py + bx * ay - by * ax) / norm
            if d > best:
                best, idx = d, i
        if best > tol and idx > 0:
            keep[idx] = True
            stack.append((a, idx))
            stack.append((idx, b))
    return [p for p, k in zip(points, keep) if k]


def rings_of(geom):
    if geom["type"] == "Polygon":
        return geom["coordinates"]
    if geom["type"] == "MultiPolygon":
        return [r for poly in geom["coordinates"] for r in poly]
    return []


def build_path(features, bbox, margin, project, tol):
    x0, y0, x1, y1 = bbox
    ex0, ey0, ex1, ey1 = x0 - margin, y0 - margin, x1 + margin, y1 + margin
    parts = []
    for f in features:
        for ring in rings_of(f["geometry"]):
            rx0, ry0, rx1, ry1 = ring_bbox(ring)
            if rx1 < ex0 or rx0 > ex1 or ry1 < ey0 or ry0 > ey1:
                continue
            # Clamp to an expanded box; artefacts stay outside the visible area
            pts = [project(min(max(lon, ex0), ex1), min(max(lat, ey0), ey1)) for lon, lat in ring]
            pts = dp_simplify(pts, tol)
            pts = [(round(x, 1), round(y, 1)) for x, y in pts]
            dedup = [pts[0]] + [p for i, p in enumerate(pts[1:], 1) if p != pts[i - 1]]
            if len(dedup) < 3:
                continue
            xs = [p[0] for p in dedup]
            ys = [p[1] for p in dedup]
            if max(xs) - min(xs) < 0.6 and max(ys) - min(ys) < 0.6:
                continue  # drop specks below rendering size
            parts.append("M" + "L".join(f"{x:g} {y:g}" for x, y in dedup) + "Z")
    return "".join(parts)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("land")
    ap.add_argument("deep")
    ap.add_argument("out")
    ap.add_argument("--bbox", nargs=4, type=float, required=True, metavar=("W", "S", "E", "N"))
    ap.add_argument("--width", type=float, default=320)
    ap.add_argument("--tol", type=float, default=0.35)
    args = ap.parse_args()

    w, s, e, n = args.bbox
    scale = args.width / (e - w)
    height = (n - s) * scale

    def project(lon, lat):
        return (lon - w) * scale, (n - lat) * scale

    with open(args.land, encoding="utf-8") as fh:
        land = json.load(fh)["features"]
    with open(args.deep, encoding="utf-8") as fh:
        deep = json.load(fh)["features"]

    out = {
        "bbox": [w, s, e, n],
        "width": args.width,
        "height": round(height, 1),
        "scale": scale,
        "land": build_path(land, (w, s, e, n), 1.0, project, args.tol),
        "deep": build_path(deep, (w, s, e, n), 1.0, project, args.tol),
    }
    with open(args.out, "w", encoding="utf-8") as fh:
        json.dump(out, fh)
    print(f"{args.out}: {out['width']}x{out['height']}, land {len(out['land'])} chars, deep {len(out['deep'])} chars")


if __name__ == "__main__":
    main()
