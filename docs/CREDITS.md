# Credits & sources

## Photography (internal use, from tasgroup.com.my)

All images were downloaded from the TAS Group website, converted to WebP and stored locally in `/public/images`. None are hotlinked.

| File | Source URL | Notes |
|---|---|---|
| `tug-tas-marine.webp` | https://tasgroup.com.my/wp-content/uploads/2024/06/boat.jpg | TAS Marine 102 tug |
| `tug-barge.webp` | https://tasgroup.com.my/wp-content/uploads/2024/06/Warehouse-in-Penang-Klang-KLIA-Singapore-1.jpg | Cropped: top half, tug with dry bulk barge |
| `project-cargo.webp` | https://tasgroup.com.my/wp-content/uploads/2024/06/project.jpg | Heavy-lift project cargo at the quay |
| `trucks.webp` | https://tasgroup.com.my/wp-content/uploads/2024/06/Untitled-design-13.jpg | Group trucks |
| `warehouse.webp` | https://tasgroup.com.my/wp-content/uploads/2024/06/Warehouse-in-Penang-Klang-KLIA-Singapore-2.jpg | Cropped: warehouse interior, banner removed |

## Map data

- Coastlines: **Natural Earth** via the [`world-atlas`](https://github.com/topojson/world-atlas) package (`land-50m`, `land-10m`), public domain. Pre-rendered to SVG paths by `scripts/build-geo.ts`.
- Projection and paths: [`d3-geo`](https://github.com/d3/d3-geo) (ISC), [`topojson-client`](https://github.com/topojson/topojson-client) (ISC).
- Port positions are approximate public coordinates for each port or town, for display only. The port list is from the WINWIN Lines table on tasgroup.com.my/our-services.

## Facts

- tasgroup.com.my/about-the-company: history, group companies and registration numbers, credentials, offices.
- tasgroup.com.my/our-services: services, fleet, warehouses, WINWIN Lines port list.
- MarineTraffic company directory: TAS Maritime founded 2006 (single source, labelled on the page).

## Type

Barlow Condensed, Barlow and Saira Stencil (SIL Open Font License), and JetBrains Mono (OFL), all loaded with `next/font/google`.

## Illustration

All SVG illustration (harbour scene, crane, vessels, tug, plane, truck, telegraph, stamps, signal flags, blueprint diagram, containers) is original to this project.
