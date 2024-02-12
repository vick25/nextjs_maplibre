'use client';
import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import styles from '@/app/page.module.css';

export default function Map() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng] = useState(21.753);
    const [lat] = useState(-3.6844);
    const [zoom] = useState(4);
    // const [API_KEY] = useState('YOUR_MAPTILER_API_KEY_HERE');

    useEffect(() => {
        if (map.current) return; // stops map from intializing more than once

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: `https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json`,//`https://demotiles.maplibre.org/style.json`,
            center: [lng, lat],
            zoom: zoom
        });

        map.current.addControl(new maplibregl.ScaleControl(), 'top-right');
        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
        map.current.addControl(new maplibregl.FullscreenControl(), 'top-right');
        map.current.addControl(new maplibregl.GeolocateControl(), 'top-right');

        map.current.on('load', () => {
            map.current.addSource('basin_countries', {
                'type': 'vector',
                'tiles': [
                    'http://localhost:7800/public.basin_countries/{z}/{x}/{y}.pbf'
                ]
            });
            map.current.addLayer({
                'id': 'basin_countries-data',
                'type': 'line',
                'source': 'basin_countries',
                'source-layer': 'public.basin_countries',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#ff69b4',
                    'line-width': 3
                }
            });

            // Create a popup, but don't add it to the map yet.
            const popup = new maplibregl.Popup({
                closeButton: false,
                closeOnClick: false
            });

            map.current.on('mouseenter', 'basin_countries-data', (e) => {
                // Change the cursor style as a UI indicator.
                map.current.getCanvas().style.cursor = 'pointer';

                const coordinates = e.features[0].geometry.coordinates.slice();
                const description = e.features[0].properties.description;

                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                // Populate the popup and set its coordinates
                // based on the feature found.
                popup.setLngLat(coordinates).setHTML(description).addTo(map.current);
            });

            map.current.on('mouseleave', 'basin_countries-data', () => {
                map.current.getCanvas().style.cursor = '';
                popup.remove();
            });
        });

    }, [lng, lat, zoom]);

    return (
        <div className={styles.map_wrap}>
            <div ref={mapContainer} className={styles.map} />
        </div>
    );
}