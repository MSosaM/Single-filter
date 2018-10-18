define([
    "qlik",
    "jquery",
    "text!./style.css",
    "text!./template.html",
    "./initial-properties",
    'ng!$q'
], function (qlik, $, cssContent, template, initialProps, $q) {
    "use strict";

    var app = qlik.currApp();

    return {
		
        controller: ['$scope', '$element', function ($scope, $element) {

			console.log("single layout: ",$scope.layout);

			$scope.qvId = $scope.layout.qInfo.qId;


            $("<style>").html(cssContent).appendTo("head");
            
			var height = $element.height();

			$scope.$watchCollection("layout.backgroundColor",function(nval){
				$scope.style = 'background-color: '+$scope.layout.backgroundColor+' !important;opacity: 1 !important;position:fixed;border-color:#CCCCCC;color:' + $scope.layout.textColor
			});

			$scope.$watchCollection("layout.textColor",function(nval){
				$scope.style = 'background-color: '+$scope.layout.backgroundColor+' !important;opacity: 1 !important;position:fixed;border-color:#CCCCCC;color:' + $scope.layout.textColor
			})


            $scope.data = [];
            $scope.showing = false;
            $scope.cl='';

			$scope.$watchCollection("layout.qListObject.qDataPages[0]",function(nval){
				$scope.data = [];
				$scope.backendApi.eachDataRow(function(rownum, row) {
					$scope.data.push({elemNumber: row[0].qElemNumber, text: row[0].qText, state: row[0].qState});
					return $scope.data
				});
			})
			

            $scope.filter = function(value){
				var val = parseInt(value,10);
				$scope.backendApi.selectValues(0, [val], true);
			};
			

			$scope.iconStyle = "lui-icon lui-icon--large lui-icon--handle";
			
			$scope.iconName = $scope.layout.openIconName;
			var iy = 0;
            $scope.showMenu = function(d){
				$("[tid="+ $scope.qvId +"]").addClass("ts");
					$scope.iconName = $scope.layout.closeIconName;
					$scope.showing = true;
			}

			$scope.hide = function(d){

				$("[tid="+ $scope.qvId +"]").removeClass("ts");
					$scope.iconName = $scope.layout.openIconName;
					$scope.showing = false;
			}

            
            
        }],
        template: template,
        initialProperties: initialProps,
        definition: {
            
        
			type: "items",
			component: "accordion",
			items: {
				dimension: {
					type: "items",
					label: "Dimensions",
					ref: "qListObjectDef",
					min: 1,
					max: 1,
					items: {
						label: {
							type: "string",
							ref: "qListObjectDef.qDef.qFieldLabels.0",
							label: "Label",
							show: true
						},
						libraryId: {
							type: "string",
							component: "library-item",
							libraryItemType: "dimension",
							ref: "qListObjectDef.qLibraryId",
							label: "Dimension",
							show: function ( data ) {
								return data.qListObjectDef && data.qListObjectDef.qLibraryId;
							}
						},
						field: {
							type: "string",
							expression: "always",
							expressionType: "dimension",
							ref: "qListObjectDef.qDef.qFieldDefs.0",
							label: "Field",
							show: function ( data ) {
								return data.qListObjectDef && !data.qListObjectDef.qLibraryId;
							}
						}
					}
				},				
				settings: {
					uses : "settings",
					items: {
						iconSection: {
							type: "items",
							label: "Icon Section",
							items:{
								textColor: {
									type: "string",
									ref: "textColor",
									label: "Text color",
									expression: "optional",
									defaultValue: "#002e5f"

								},
								backgroundColor: {
									type: "string",
									ref: "backgroundColor",
									label: "Background color",
									expression: "optional",
									defaultValue: "#FFFFFF"

								},
								openIcon: {
									type: "string",
									ref: "openIconName",
									label: "Open icon",
									expression: "optional",
									defaultValue: "line-menu.png"

								},
								closeIcon: {
									type: "string",
									ref: "closeIconName",
									label: "Close icon",
									expression: "optional",
									defaultValue: "cancel-music.png"
								},
								iconsSize: {
									type: "number",
									ref: "iconSize",
									label: "Icon size",
									expression: "optional",
									defaultValue: "24"
								},
								iconText: {
									type: "string",
									ref: "iconText",
									label: "Icon text",
								}
							}
						}
					}
				}
			}
				}        
    };
});