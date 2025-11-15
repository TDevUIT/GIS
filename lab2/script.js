function blockRenderer(height, color, edgeColor) {
    return {
        type: "simple",
        symbol: {
            type: "polygon-3d",
            symbolLayers: [
                {
                    type: "extrude",
                    size: height,
                    material: {
                        color: color,
                    },
                    outline: {
                        color: edgeColor, // Màu viền
                        size: 5, // Độ dày viền
                    },
                },
            ],
        },
    };
}

function GLBRenderer({ href, heading, pitch = 0, roll = 0 }) {
    return {
        type: "simple",
        symbol: {
            type: "point-3d",
            symbolLayers: [
                {
                    type: "object",
                    resource: {
                        href,
                    },
                    heading,
                    pitch,
                    roll,
                },
            ],
        },
    };
}

require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/GeoJSONLayer",
    "esri/Graphic",
    "esri/geometry/Mesh",
    "esri/geometry/Point",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/layers/SceneLayer",
    "esri/layers/GraphicsLayer",
    "esri/request",
], function (
    Map,
    SceneView,
    GeoJSONLayer,
    Graphic,
    Point,
    Mesh,
    SimpleMarkerSymbol,
    SceneLayer,
    GraphicsLayer,
    esriRequest
) {
    const map = new Map({
        basemap: "topo-vector",
        ground: "world-elevation",
    });

    const view = new SceneView({
        container: "viewDiv",
        map: map,
        camera: {
            position: [106.69845597091415, 10.769024419182566, 300],
            heading: 0,
            tilt: 50,
        },
    });

    //function to create graphic layer
    var createGraphic = function (data) {
        return new Graphic({
            geometry: data,
            symbol: data.symbol,
            attributes: data,
            popupTemplate: data.popupTemplate,
        });
    };

    const json_options = {
        query: {
            f: "json",
        },
        responseType: "json",
    };

    // Thêm nền
    esriRequest("./data/cuaChinh/base.json", json_options).then(
        function (response) {
            var graphicsLayer = new GraphicsLayer();
            console.log(response);
            response.data.forEach(function (data) {
                graphicsLayer.add(createGraphic(data));
            });
            map.add(graphicsLayer);
        }
    );

    // Function to create GeoJSONLayer
    function createGeoJsonLayer(name, renderer) {
        return new GeoJSONLayer({
            url: "data/" + name + ".geojson",
            renderer: renderer,
        });
    }

    //START: Cửa Chính
    //Nửa bên trái
    //Cổng trái
    map.add(createGeoJsonLayer("cuaChinh/data", blockRenderer(4.5, "#D3D3D3"))); //O K' D1 S
    map.add(createGeoJsonLayer("cuaChinh/data2", blockRenderer(1, "#D3D3D3"))); //W B1 N L
    map.add(createGeoJsonLayer("cuaChinh/data3", blockRenderer(0.3, "#D3D3D3"))); //K' D1 N L
    map.add(createGeoJsonLayer("cuaChinh/data4", blockRenderer(4.5, "#D3D3D3"))); //Q T N L

    //Cổng giữa
    map.add(createGeoJsonLayer("cuaChinh/data5", blockRenderer(5.8, "#D3D3D3"))); //L N U R
    map.add(createGeoJsonLayer("cuaChinh/data6", blockRenderer(1, "#D3D3D3"))); //J1 K1 U R
    map.add(createGeoJsonLayer("cuaChinh/data7", blockRenderer(0.3, "#D3D3D3"))); //L N M L'

    //Thêm mesh Cửa Chính
    map.add(
        createGeoJsonLayer(
            "cuaChinh/middleGate",
            GLBRenderer({
                href: "./meshObject/cuaChinh/cuaGiua.glb",
                heading: "328",
            })
        )
    );

    map.add(
        createGeoJsonLayer(
            "cuaChinh/rightGate",
            GLBRenderer({
                href: "./meshObject/cuaChinh/cuaPhai.glb",
                heading: "328",
            })
        )
    );

    map.add(
        createGeoJsonLayer(
            "cuaChinh/leftGate",
            GLBRenderer({
                href: "./meshObject/cuaChinh/cuaTrai.glb",
                heading: "328",
            })
        )
    );

    map.add(
        createGeoJsonLayer(
            "cuaChinh/vent1",
            GLBRenderer({
                href: "./meshObject/cuaChinh/cuaThongGio.glb",
                heading: "419",
            })
        )
    );

    map.add(
        createGeoJsonLayer(
            "cuaChinh/vent2",
            GLBRenderer({
                href: "./meshObject/cuaChinh/cuaThongGio.glb",
                heading: "419",
            })
        )
    );

    map.add(
        createGeoJsonLayer(
            "cuaChinh/vent3",
            GLBRenderer({
                href: "./meshObject/cuaChinh/cuaThongGio.glb",
                heading: "239.25",
            })
        )
    );

    map.add(
        createGeoJsonLayer(
            "cuaChinh/vent4",
            GLBRenderer({
                href: "./meshObject/cuaChinh/cuaThongGio.glb",
                heading: "239.25",
            })
        )
    );

    map.add(
        createGeoJsonLayer(
            "cuaChinh/nameBoard",
            GLBRenderer({
                href: "./meshObject/cuaChinh/bangTen.glb",
                heading: "328",
            })
        )
    );
    //END: Cửa Chính

    //START: 3 Mái Lớn
    // 2 Mai Lon "#D3D3D3" "#8B0000" mau do nau
    map.add(createGeoJsonLayer("maiNhaLon/2mai", blockRenderer(0.5, "#8B0000")));
    // Tuong duoi mai lon HCN
    map.add(
        createGeoJsonLayer("maiNhaLon/tuong_duoi_HCN", blockRenderer(6, "#D3D3D3"))
    );
    //Tuong tren mai lon tam giac
    map.add(
        createGeoJsonLayer(
            "maiNhaLon/tuong_tren_tam_giac",
            blockRenderer(6, "#D3D3D3")
        )
    );
    // mai nho Tay Dong
    map.add(
        createGeoJsonLayer("maiNhaLon/mai_nho", blockRenderer(0.5, "#8B0000"))
    );
    //tuong nho Tay Dong
    map.add(
        createGeoJsonLayer("maiNhaLon/tuong_nho", blockRenderer(1.3, "#D3D3D3"))
    );
    //1 mai lon Bac
    map.add(
        createGeoJsonLayer("maiNhaLon/1mai_Bac", blockRenderer(0.5, "#8B0000"))
    );
    //1 tuong tren tam giac Bac
    map.add(
        createGeoJsonLayer(
            "maiNhaLon/Bac_tuong_tren_tam_giac",
            blockRenderer(6, "#D3D3D3")
        )
    );
    //1 tuong duoi HCN Bac
    map.add(
        createGeoJsonLayer(
            "maiNhaLon/Bac_tuong_duoi_HCN",
            blockRenderer(6, "#D3D3D3")
        )
    );
    //Bac mai nho
    map.add(
        createGeoJsonLayer("maiNhaLon/Bac_mai_nho", blockRenderer(0.5, "#8B0000"))
    );
    //tuong nho mai Bac
    map.add(
        createGeoJsonLayer("maiNhaLon/Bac_tuong_nho", blockRenderer(1.3, "#D3D3D3"))
    );

    //mai nho Nam  W3 V3 Z3 C4 A4 B4
    map.add(
        createGeoJsonLayer("maiNhaLon/Nam_mai_nho", blockRenderer(0.5, "#8B0000"))
    );
    //tuong nho Nam  E4 D4 F4 I4 G4 H4
    map.add(
        createGeoJsonLayer("maiNhaLon/Nam_tuong_nho", blockRenderer(1.3, "#D3D3D3"))
    );
    //END: 3 Mái Lớn

    //START: Cửa bắc
    //Cổng trái, phải
    map.add(createGeoJsonLayer("cuaBac/data", blockRenderer(4.5, "#D3D3D3"))); //P1 O1 N1 Q1, U1 R1 S1 T1
    map.add(createGeoJsonLayer("cuaBac/data2", blockRenderer(1, "#D3D3D3"))); //V1 W1 Z1 A2, D2 E2 F2 G2
    map.add(createGeoJsonLayer("cuaBac/data3", blockRenderer(0.3, "#D3D3D3"))); //U1 R1 Z1 A2, D2 E2 N1 Q1
    map.add(createGeoJsonLayer("cuaBac/data4", blockRenderer(4.5, "#D3D3D3"))); //H2 I2 Z1 A2, D2 E2 J2 K2

    //Cổng giữa
    map.add(createGeoJsonLayer("cuaBac/data5", blockRenderer(5.8, "#D3D3D3"))); //A2 Z1 L2 M2, N2 O2 E2 D2
    map.add(createGeoJsonLayer("cuaBac/data6", blockRenderer(1, "#D3D3D3"))); //P2 Q2 L2 M2, N2 O2 R2 S2
    map.add(createGeoJsonLayer("cuaBac/data7", blockRenderer(0.3, "#D3D3D3"))); //A2 Z1 E2 D2

    map.add(
        createGeoJsonLayer(
            "cuaBac/vent1",
            GLBRenderer({
                href: "./meshObject/cuaBac/cuaThongGio.glb",
                heading: "239",
            })
        )
    );

    map.add(
        createGeoJsonLayer(
            "cuaBac/vent2",
            GLBRenderer({
                href: "./meshObject/cuaBac/cuaThongGio.glb",
                heading: "239",
            })
        )
    );

    map.add(
        createGeoJsonLayer(
            "cuaBac/vent3",
            GLBRenderer({
                href: "./meshObject/cuaBac/cuaThongGio.glb",
                heading: "59",
            })
        )
    );

    map.add(
        createGeoJsonLayer(
            "cuaBac/vent4",
            GLBRenderer({
                href: "./meshObject/cuaBac/cuaThongGio.glb",
                heading: "59",
            })
        )
    );

    map.add(
        createGeoJsonLayer(
            "cuaBac/gate",
            GLBRenderer({
                href: "./meshObject/cuaBac/cuaBac.glb",
                heading: "507.5",
            })
        )
    );

    //END: Cửa Bắc

    //START: Cửa Đông
    //Cổng trái, phải
    map.add(createGeoJsonLayer("cuaDong/data", blockRenderer(4.5, "#D3D3D3"))); //B1 W I1 L1, Q1 Z1 A2 W'
    map.add(createGeoJsonLayer("cuaDong/data2", blockRenderer(1, "#D3D3D3"))); //D2 F2 N1 G1, E2 G2 V1 S1
    map.add(createGeoJsonLayer("cuaDong/data3", blockRenderer(0.3, "#D3D3D3"))); //W I1 N1 G1, W' A2 V1 S1
    map.add(createGeoJsonLayer("cuaDong/data4", blockRenderer(4.5, "#D3D3D3"))); //E1 M1 N1 G1, R1 S1 V1 W1

    //Cổng giữa
    map.add(createGeoJsonLayer("cuaDong/data5", blockRenderer(5.8, "#D3D3D3"))); //G1 N1 I2 K2, S1 V1 H2 J2
    map.add(createGeoJsonLayer("cuaDong/data6", blockRenderer(1, "#D3D3D3"))); //K2 I2 O1 H1, J2 H2 U1 T1
    map.add(createGeoJsonLayer("cuaDong/data7", blockRenderer(0.3, "#D3D3D3"))); //S1 V1 N1 G1

    //Thêm mesh Cửa Đông
    map.add(
        createGeoJsonLayer(
            "cuaDong/vent1",
            GLBRenderer({
                href: "./meshObject/cuaDong/cuaThongGio.glb",
                heading: "329",
            })
        )
    );

    map.add(
        createGeoJsonLayer(
            "cuaDong/vent2",
            GLBRenderer({
                href: "./meshObject/cuaDong/cuaThongGio.glb",
                heading: "329",
            })
        )
    );

    map.add(
        createGeoJsonLayer("mainho/Bac_tuong_lon", blockRenderer(2, "#D3D3D3"))
    );
    map.add(
        createGeoJsonLayer("mainho/Bac_tuong_vuong", blockRenderer(2, "#D3D3D3"))
    );

    map.add(
        createGeoJsonLayer(
            "cuaDong/vent3",
            GLBRenderer({
                href: "./meshObject/cuaDong/cuaThongGio.glb",
                heading: "149",
            })
        )
    );

    map.add(
        createGeoJsonLayer(
            "cuaDong/vent4",
            GLBRenderer({
                href: "./meshObject/cuaDong/cuaThongGio.glb",
                heading: "149",
            })
        )
    );

    map.add(
        createGeoJsonLayer(
            "cuaDong/gate",
            GLBRenderer({
                href: "./meshObject/cuaDong/cuaDong.glb",
                heading: "329",
            })
        )
    );
    //END: Cửa Đông

    //START: Cửa Tây
    //Cổng trái, phải
    map.add(createGeoJsonLayer("cuaTay/data", blockRenderer(4.5, "#D3D3D3"))); //V2 W2 C3 A3, Q3 P3 O3 M3
    map.add(createGeoJsonLayer("cuaTay/data2", blockRenderer(1, "#D3D3D3"))); //Z2 B3 E3 N2, R3 N3 K3 T2
    map.add(createGeoJsonLayer("cuaTay/data3", blockRenderer(0.3, "#D3D3D3"))); //V2 A3 E3 N2, P3 O3 K3 T2
    map.add(createGeoJsonLayer("cuaTay/data4", blockRenderer(4.5, "#D3D3D3"))); //M2 N2 E3 D3, T2 U2 L3 K3

    //Cổng giữa
    map.add(createGeoJsonLayer("cuaTay/data5", blockRenderer(5.8, "#D3D3D3"))); //N2 E3 G3 P2, T2 K3 I3 R2
    map.add(createGeoJsonLayer("cuaTay/data6", blockRenderer(1, "#D3D3D3"))); //O2 F3 G3 P2, R2 I3 J3 S2
    map.add(createGeoJsonLayer("cuaTay/data7", blockRenderer(0.3, "#D3D3D3"))); //N2 E3 K3 T2

    //Thêm mesh Cửa Tây
    map.add(
        createGeoJsonLayer(
            "cuaTay/vent1",
            GLBRenderer({
                href: "./meshObject/cuaTay/cuaThongGio.glb",
                heading: "508",
            })
        )
    );

    map.add(
        createGeoJsonLayer(
            "cuaTay/vent2",
            GLBRenderer({
                href: "./meshObject/cuaTay/cuaThongGio.glb",
                heading: "508",
            })
        )
    );

    map.add(
        createGeoJsonLayer(
            "cuaTay/vent3",
            GLBRenderer({
                href: "./meshObject/cuaTay/cuaThongGio.glb",
                heading: "328",
            })
        )
    );

    map.add(
        createGeoJsonLayer(
            "cuaTay/vent4",
            GLBRenderer({
                href: "./meshObject/cuaTay/cuaThongGio.glb",
                heading: "328",
            })
        )
    );

    map.add(
        createGeoJsonLayer(
            "cuaTay/gate",
            GLBRenderer({
                href: "./meshObject/cuaTay/cuaTay.glb",
                heading: "329",
            })
        )
    );
    //END: Cửa Tây

    //Start: mai dong ho
    map.add(
        createGeoJsonLayer(
            "thapDongHo/dong_ho_nam",
            GLBRenderer({
                href: "./meshObject/thapDongHo/dongHo.glb",
                heading: "238",
            })
        )
    );
    map.add(
        createGeoJsonLayer(
            "thapDongHo/dong_ho_bac",
            GLBRenderer({
                href: "./meshObject/thapDongHo/dongHo.glb",
                heading: "418",
            })
        )
    );
    map.add(
        createGeoJsonLayer(
            "thapDongHo/dong_ho_dong",
            GLBRenderer({
                href: "./meshObject/thapDongHo/dongHo.glb",
                heading: "328",
            })
        )
    );
    map.add(
        createGeoJsonLayer(
            "thapDongHo/dong_ho_tay",
            GLBRenderer({
                href: "./meshObject/thapDongHo/dongHo.glb",
                heading: "508",
            })
        )
    );

    map.add(
        createGeoJsonLayer(
            "thapDongHo/chop_thap_dong_ho",
            GLBRenderer({
                href: "./meshObject/thapDongHo/chopThapDongHo.glb",
                heading: "508",
            })
        )
    );

    map.add(
        createGeoJsonLayer(
            "thapDongHo/mai_noi_thap_dho",
            blockRenderer(0.5, "#8B0000", "#FFFEE8")
        )
    );
    map.add(
        createGeoJsonLayer("thapDongHo/tuong_dongho", blockRenderer(5.9, "#D3D3D3"))
    );
    map.add(
        createGeoJsonLayer(
            "thapDongHo/tuong_tamgiactrang",
            blockRenderer(12, "#FFFEE8")
        )
    );
    map.add(
        createGeoJsonLayer("thapDongHo/than_thap", blockRenderer(20, "#FFFEE8"))
    );
    map.add(
        createGeoJsonLayer(
            "thapDongHo/phan_tren_thanthap",
            blockRenderer(0.3, "#FFFEE0")
        )
    );
    map.add(
        createGeoJsonLayer(
            "thapDongHo/phan_than_ganmai",
            blockRenderer(1.5, "#FFFEE8")
        )
    );

    //START: Phần viền ngoài từ cửa Bắc - Đông, Bắc - Tây
    //2HCN nho len
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/2HCN_NhoLen",
            blockRenderer(1.9, "#D3D3D3")
        )
    );
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/2HCN_ChuaTron",
            blockRenderer(1.05, "#D3D3D3")
        )
    );
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/2HCN_ChuaTron_GanCuaBac",
            blockRenderer(1.05, "#D3D3D3")
        )
    );
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/2HCNnho_NoiVoiCuaBac",
            blockRenderer(1.05, "#D3D3D3")
        )
    );

    //CuaSo1
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo1",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "59",
            })
        )
    );
    //CuaSo2
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo2",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "59",
            })
        )
    );
    //CuaSo3
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo3",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "59",
            })
        )
    );
    //END: Cửa Tây

    //StartChinhTay

    esriRequest("./data/chinhTay/cuaChinhTay.geojson", {
        responseType: "json",
    }).then((response) => {
        const features = response.data.features;

        features.forEach((feature) => {
            if (feature.geometry.type === "MultiPoint") {
                feature.geometry.coordinates.forEach((point) => {
                    const graphic = new Graphic({
                        geometry: {
                            type: "point",
                            longitude: point[0],
                            latitude: point[1],
                            z: point[2],
                        },
                        symbol: GLBRenderer({
                            href: "./meshObject/cuaSo/cuaSo.glb",
                            heading: "239",
                        }).symbol,
                    });

                    // Add the graphic to a GraphicsLayer
                    const graphicsLayer = new GraphicsLayer();
                    graphicsLayer.add(graphic);
                    map.add(graphicsLayer);
                });
            }
        });
    });

    esriRequest("./data/chinhTay/cuaChinhTay_2.geojson", {
        responseType: "json",
    }).then((response) => {
        const features = response.data.features;

        features.forEach((feature) => {
            if (feature.geometry.type === "MultiPoint") {
                feature.geometry.coordinates.forEach((point) => {
                    const graphic = new Graphic({
                        geometry: {
                            type: "point",
                            longitude: point[0],
                            latitude: point[1],
                            z: point[2],
                        },
                        symbol: GLBRenderer({
                            href: "./meshObject/cuaSo/cuaSo.glb",
                            heading: "148",
                        }).symbol,
                    });

                    // Add the graphic to a GraphicsLayer
                    const graphicsLayer = new GraphicsLayer();
                    graphicsLayer.add(graphic);
                    map.add(graphicsLayer);
                });
            }
        });
    });

    map.add(
        createGeoJsonLayer("chinhTay/maiChinhTay", blockRenderer(1.9, "#D3D3D3"))
    ); //O K' D1 S

    map.add(
        createGeoJsonLayer("chinhTay/maiChinhTay_2", blockRenderer(1.9, "#D3D3D3"))
    ); //O K' D1 S

    //End chinh tay

    //Start: Chinh dong
    esriRequest("./data/chinhDong/cuaChinhDong.geojson", {
        responseType: "json",
    }).then((response) => {
        const features = response.data.features;

        features.forEach((feature) => {
            if (feature.geometry.type === "MultiPoint") {
                feature.geometry.coordinates.forEach((point) => {
                    const graphic = new Graphic({
                        geometry: {
                            type: "point",
                            longitude: point[0],
                            latitude: point[1],
                            z: point[2],
                        },
                        symbol: GLBRenderer({
                            href: "./meshObject/cuaSo/cuaSo.glb",
                            heading: "58",
                        }).symbol,
                    });

                    // Add the graphic to a GraphicsLayer
                    const graphicsLayer = new GraphicsLayer();
                    graphicsLayer.add(graphic);
                    map.add(graphicsLayer);
                });
            }
        });
    });

    esriRequest("./data/chinhDong/cuaChinhDong_2.geojson", {
        responseType: "json",
    }).then((response) => {
        const features = response.data.features;

        features.forEach((feature) => {
            if (feature.geometry.type === "MultiPoint") {
                feature.geometry.coordinates.forEach((point) => {
                    const graphic = new Graphic({
                        geometry: {
                            type: "point",
                            longitude: point[0],
                            latitude: point[1],
                            z: point[2],
                        },
                        symbol: GLBRenderer({
                            href: "./meshObject/cuaSo/cuaSo.glb",
                            heading: "148",
                        }).symbol,
                    });

                    // Add the graphic to a GraphicsLayer
                    const graphicsLayer = new GraphicsLayer();
                    graphicsLayer.add(graphic);
                    map.add(graphicsLayer);
                });
            }
        });
    });
    map.add(
        createGeoJsonLayer("chinhDong/maiChinhDong", blockRenderer(1.9, "#D3D3D3"))
    ); //O K' D1 S
    map.add(
        createGeoJsonLayer(
            "chinhDong/maiChinhDong_2",
            blockRenderer(1.9, "#D3D3D3")
        )
    ); //O K' D1 S
    //End chinh dong

    //CuaSo4
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo4",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "59",
            })
        )
    );
    //CuaSo5
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo5",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "59",
            })
        )
    );
    //CuaSo6
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo6",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "59",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo7",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "59",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo8",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "59",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo9",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "59",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo10",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "59",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo11",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "59",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo12",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "59",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo13",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "59",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo14",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "59",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo15",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "59",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo16",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "59",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo17",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "59",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo18",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "59",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo19",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "59",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo20",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "59",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo21",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "59",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo21",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "59",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo22",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "-32",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo23",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "-32",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo24",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "-32",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo25",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "-32",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo26",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "-32",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo27",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "-32",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo28",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "-32",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo29",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "-32",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo30",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "-32",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo31",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "-32",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo32",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "-32",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo33",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "-32",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo34",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "-32",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo35",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "-32",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo36",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "-32",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo37",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "-32",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo38",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "-32",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo39",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "-32",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo40",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "-32",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo41",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "-32",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo42",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "-32",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo43",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "-32",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo44",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "-32",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo45",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "-32",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo46",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "-32",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo47",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "-32",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo48",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "239",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo49",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "239",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo50",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "239",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo51",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "239",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo52",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "239",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo53",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "239",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo54",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "239",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo55",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "239",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo56",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "239",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo57",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "239",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo58",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "239",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo59",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "239",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo60",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "239",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo61",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "239",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo62",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "239",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo63",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "239",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo64",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "239",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo65",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "239",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo66",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "239",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo67",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "239",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo68",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "59",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo69",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "17",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo70",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "-32",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo71",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "-32",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo72",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "239",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo73",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "294",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo74",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "-32",
            })
        )
    );
    //CuaSo7
    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/CuaSo75",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/CuaSo.glb",
                heading: "-32",
            })
        )
    );

    map.add(
        createGeoJsonLayer(
            "phanVienTuCuaBacDong-CuaBacTay/vomVienCuaBac",
            GLBRenderer({
                href: "./meshObject/PhanVienBacDong-BacTay/vomVienCuaBac.glb",
                heading: "328",
            })
        )
    );

    map.add(
        createGeoJsonLayer(
            "cuaSoMaiNho/mai1",
            GLBRenderer({
                href: "./meshObject/maiNho/cuaSoMaiNho.glb",
                heading: "328",
            })
        )
    );
    map.add(
        createGeoJsonLayer(
            "cuaSoMaiNho/mai2",
            GLBRenderer({
                href: "./meshObject/maiNho/cuaSoMaiNho.glb",
                heading: "328",
            })
        )
    );
    map.add(
        createGeoJsonLayer(
            "cuaSoMaiNho/mai3",
            GLBRenderer({
                href: "./meshObject/maiNho/cuaSoMaiNho.glb",
                heading: "328",
            })
        )
    );
    map.add(
        createGeoJsonLayer(
            "cuaSoMaiNho/mai4",
            GLBRenderer({
                href: "./meshObject/maiNho/cuaSoMaiNho.glb",
                heading: "328",
            })
        )
    );
    map.add(
        createGeoJsonLayer(
            "cuaSoMaiNho/mai5",
            GLBRenderer({
                href: "./meshObject/maiNho/cuaSoMaiNho.glb",
                heading: "328",
            })
        )
    );
    map.add(
        createGeoJsonLayer(
            "cuaSoMaiNho/mai6",
            GLBRenderer({
                href: "./meshObject/maiNho/cuaSoMaiNho.glb",
                heading: "328",
            })
        )
    );
    map.add(
        createGeoJsonLayer(
            "cuaSoMaiNho/mai7",
            GLBRenderer({
                href: "./meshObject/maiNho/cuaSoMaiNho.glb",
                heading: "508",
            })
        )
    );
    map.add(
        createGeoJsonLayer(
            "cuaSoMaiNho/mai8",
            GLBRenderer({
                href: "./meshObject/maiNho/cuaSoMaiNho.glb",
                heading: "508",
            })
        )
    );
    map.add(
        createGeoJsonLayer(
            "cuaSoMaiNho/mai9",
            GLBRenderer({
                href: "./meshObject/maiNho/cuaSoMaiNho.glb",
                heading: "508",
            })
        )
    );
    map.add(
        createGeoJsonLayer(
            "cuaSoMaiNho/mai10",
            GLBRenderer({
                href: "./meshObject/maiNho/cuaSoMaiNho.glb",
                heading: "508",
            })
        )
    );
    map.add(
        createGeoJsonLayer(
            "cuaSoMaiNho/mai11",
            GLBRenderer({
                href: "./meshObject/maiNho/cuaSoMaiNho.glb",
                heading: "508",
            })
        )
    );
    map.add(
        createGeoJsonLayer(
            "cuaSoMaiNho/mai12",
            GLBRenderer({
                href: "./meshObject/maiNho/cuaSoMaiNho.glb",
                heading: "508",
            })
        )
    );

    //3 tuong phai HCN
    map.add(
        createGeoJsonLayer(
            "mainho/3tuong_phai_HCN",
            blockRenderer(4.765, "#D3D3D3")
        )
    );
    //3 tuong phai Tam giac
    map.add(
        createGeoJsonLayer(
            "mainho/3tuong_phai_tam_giac",
            blockRenderer(2.5, "#D3D3D3")
        )
    );

    map.add(
        createGeoJsonLayer("mainho/mai_Bac_nho", blockRenderer(0.22, "#8B0000"))
    );
    map.add(
        createGeoJsonLayer(
            "mainho/mai_Bac_nho copy",
            blockRenderer(0.22, "#8B0000")
        )
    );
    map.add(
        createGeoJsonLayer("mainho/mai_Nam_nho", blockRenderer(0.22, "#8B0000"))
    );
    map.add(
        createGeoJsonLayer(
            "mainho/mai_Nam_nho copy",
            blockRenderer(0.22, "#8B0000")
        )
    );
    map.add(
        createGeoJsonLayer("mainho/Nam_tuong_nho", blockRenderer(0.635, "#D3D3D3"))
    );
    map.add(
        createGeoJsonLayer("mainho/Bac_tuong_lon", blockRenderer(2, "#D3D3D3"))
    );
    map.add(
        createGeoJsonLayer("mainho/Bac_tuong_vuong", blockRenderer(2, "#D3D3D3"))
    );
});
