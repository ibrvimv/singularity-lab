'use client'

import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl, { Map, Layer } from "mapbox-gl"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''

interface SymbolLayer extends mapboxgl.Layer {
	type: 'symbol';
	layout: {
		'text-field'?: string;
		// add other properties if needed
	};
}
const MapComponent = () => {
	const mapContainer = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (mapContainer.current) {
			const map: Map = new mapboxgl.Map({
				container: mapContainer.current,
				style: "mapbox://styles/mapbox/streets-v10",
				center: [2.294481, 48.85837],
				zoom: 16,
				pitch: 60,
			})
			map.on("load", () => {
				const layers = map?.getStyle()?.layers;
				const layerArray: Layer[] = Array.isArray(layers) ? layers : [];
				const labelLayer = layerArray.find(
					(layer): layer is SymbolLayer =>
						layer.type === 'symbol' && (layer.layout as any)['text-field']
				);
				if (labelLayer) {
					map.addLayer(
						{
							'id': 'add-3d-buildings',
							'source': 'composite',
							'source-layer': 'building',
							'filter': ['==', 'extrude', 'true'],
							'type': 'fill-extrusion',
							'minzoom': 15,
							'paint': {
								'fill-extrusion-color': '#aaa',

								// Use an 'interpolate' expression to
								// add a smooth transition effect to
								// the buildings as the user zooms in.
								'fill-extrusion-height': [
									'interpolate',
									['linear'],
									['zoom'],
									15,
									0,
									15.05,
									['get', 'height']
								],
								'fill-extrusion-base': [
									'interpolate',
									['linear'],
									['zoom'],
									15,
									0,
									15.05,
									['get', 'min_height']
								],
								'fill-extrusion-opacity': 0.6
							}
						},
						labelLayer.id
					)
				}
			})
		}
	}, [])

	return (
		<div className='w-full h-full'>
			<div
				id="map"
				ref={mapContainer}
				style={{ width: "100%", height: "100vh" }}
			/>
		</div>
	)
}

export default MapComponent