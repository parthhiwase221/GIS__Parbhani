import * as React from "react";

interface QGISMapViewProps {
    mapFolder?: 'qgis2web_2025_12_08-16_09_36_742787' | 'qgis2h';
    onLayerToggle?: (layerId: string, visible: boolean) => void;
}

const QGISMapView = React.memo(React.forwardRef<HTMLIFrameElement, QGISMapViewProps>(
    ({ mapFolder = 'qgis2web_2025_12_08-16_09_36_742787' }, ref) => {
        return (
            <iframe
                ref={ref}
                src={`/${mapFolder}/index.html`}
                style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                }}
                title="QGIS-Map"
                allowFullScreen
            />
        );
    }
));

QGISMapView.displayName = 'QGISMapView';

export default QGISMapView;
