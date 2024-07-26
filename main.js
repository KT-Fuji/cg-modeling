/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var cannon_es__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! cannon-es */ "./node_modules/cannon-es/dist/cannon-es.js");
/* harmony import */ var _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tweenjs/tween.js */ "./node_modules/@tweenjs/tween.js/dist/tween.esm.js");
/* harmony import */ var three_examples_jsm_loaders_GLTFLoader_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three/examples/jsm/loaders/GLTFLoader.js */ "./node_modules/three/examples/jsm/loaders/GLTFLoader.js");




class ThreeJSContainer {
    scene;
    world;
    light;
    models;
    arm;
    goal;
    spawnQueue;
    constructor() { }
    // 画面部分の作成(表示する枠ごとに)*
    createRendererDOM = (width, height, cameraPos) => {
        let renderer = new three__WEBPACK_IMPORTED_MODULE_2__.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_2__.Color(0x495ed));
        //カメラの設定
        let camera = new three__WEBPACK_IMPORTED_MODULE_2__.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(0, 16, 0));
        // let orbitControls = new OrbitControls(camera, renderer.domElement);
        this.createScene();
        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        let render = (time) => {
            // orbitControls.update();
            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        // テクスチャの色空間に合わせて出力をsRGBに変える
        renderer.outputEncoding = three__WEBPACK_IMPORTED_MODULE_2__.sRGBEncoding;
        return renderer.domElement;
    };
    // シーンの作成(全体で1回)
    createScene = () => {
        this.scene = new three__WEBPACK_IMPORTED_MODULE_2__.Scene();
        this.world = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.World({ gravity: new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Vec3(0, -9.82, 0) });
        this.world.defaultContactMaterial.friction = 0.1;
        this.world.defaultContactMaterial.restitution = 0.5;
        this.setupScene();
        // const cannonDebugger = CannonDebugger(this.scene, this.world);
        const clock = new three__WEBPACK_IMPORTED_MODULE_2__.Clock();
        // 最初だけ開始5秒でアームが動くように設定
        let armTimer = 10;
        let spawnTimer = 3;
        // 毎フレームのupdateを呼んで，更新
        // reqestAnimationFrame により次フレームを呼ぶ
        let update = (time) => {
            this.world.fixedStep();
            const delta = clock.getDelta();
            spawnTimer += delta;
            armTimer += delta;
            if (this.arm != null) {
                if (armTimer > 15) {
                    this.arm.move(this.models, this.goal);
                    armTimer = 0;
                }
            }
            if (spawnTimer > 2) {
                if (this.spawnQueue.length > 0) {
                    this.models[this.spawnQueue[0]].getBody().velocity = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Vec3(0, 0, 0);
                    this.models[this.spawnQueue[0]].getBody().angularVelocity = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Vec3(0, 0, 0);
                    this.models[this.spawnQueue[0]].getBody().position = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Vec3((Math.random() * 2 - 1) * 8, 20, (Math.random() * 2 - 1) * 8);
                    this.models[this.spawnQueue[0]].getBody().quaternion = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Quaternion().setFromEuler(Math.random(), Math.random(), Math.random());
                    this.spawnQueue.splice(0, 1);
                }
                spawnTimer = 0;
            }
            for (const key in this.models) {
                const model = this.models[key];
                if (model == null) {
                    continue;
                }
                model.update();
                if (model.getBody().position.y < -15) {
                    if (!this.spawnQueue.includes(key)) {
                        this.spawnQueue.push(key);
                    }
                }
            }
            // cannonDebugger.update();
            requestAnimationFrame(update);
            _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.update(); //追加分
        };
        requestAnimationFrame(update);
    };
    // シーンの作成(全体で1回)
    setupScene = async () => {
        //ライトの設定
        this.light = new three__WEBPACK_IMPORTED_MODULE_2__.DirectionalLight(0xffffff);
        let lvec = new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(1, 1, 1).clone().normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
        await new three_examples_jsm_loaders_GLTFLoader_js__WEBPACK_IMPORTED_MODULE_1__.GLTFLoader().load("arm.gltf", (data) => {
            const model = data.scene;
            model.position.y = 28;
            this.arm = new Arm(model);
            this.scene.add(this.arm.getObject());
        });
        await new three_examples_jsm_loaders_GLTFLoader_js__WEBPACK_IMPORTED_MODULE_1__.GLTFLoader().load("frame.gltf", (data) => {
            const model = data.scene;
            for (const child of model.children) {
                if (child.name.search(/col_.+/) > -1) {
                    const body = getBoxBodyFromGeometry(child.geometry, 0);
                    this.world.addBody(body);
                }
                else if (child.name.search(/goal/) > -1) {
                    this.goal = child.position;
                }
            }
            this.scene.add(model);
        });
        // 透明なパネル
        const planeShape = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Plane();
        const planeBody = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Body({ mass: 0 });
        planeBody.addShape(planeShape);
        planeBody.position.set(0, 10, 10);
        planeBody.quaternion = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Quaternion().setFromEuler(0, Math.PI, 0);
        this.world.addBody(planeBody);
        this.models = [];
        this.spawnQueue = [];
        for (let index = 0; index < 30; index++) {
            const defaultPosition = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Vec3((Math.random() * 2 - 1) * 10, 20, (Math.random() * 2 - 1) * 10);
            if (Math.random() > 0.5) {
                const shape = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Vec3(1, 2.7, 1));
                const obj = new BandleObject(null, new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Body({
                    mass: 1,
                    shape: shape,
                    position: defaultPosition,
                    quaternion: new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Quaternion().setFromEuler(Math.random(), Math.random(), Math.random()),
                }));
                obj.offset.y = 2.7;
                new three_examples_jsm_loaders_GLTFLoader_js__WEBPACK_IMPORTED_MODULE_1__.GLTFLoader().load("character_model.gltf", (data) => {
                    const model = data.scene;
                    model.scale.x = 0.25;
                    model.scale.y = 0.25;
                    model.scale.z = 0.25;
                    obj.setObject(model);
                    this.scene.add(model);
                });
                this.models.push(obj);
                this.world.addBody(obj.getBody());
            }
            else {
                const shape = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Vec3(1, 1, 1));
                const obj = new BandleObject(null, new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Body({
                    mass: 1,
                    shape: shape,
                    position: defaultPosition,
                    quaternion: new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Quaternion().setFromEuler(Math.random(), Math.random(), Math.random()),
                }));
                new three_examples_jsm_loaders_GLTFLoader_js__WEBPACK_IMPORTED_MODULE_1__.GLTFLoader().load("sofken.gltf", (data) => {
                    const model = data.scene;
                    model.scale.x = 0.5;
                    model.scale.y = 0.5;
                    model.scale.z = 0.5;
                    obj.setObject(model);
                    this.scene.add(model);
                });
                this.models.push(obj);
                this.world.addBody(obj.getBody());
            }
        }
    };
}
window.addEventListener("DOMContentLoaded", init);
function init() {
    let container = new ThreeJSContainer();
    let viewport = container.createRendererDOM(640, 480, new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(0, 16, 16));
    document.body.appendChild(viewport);
}
// TJSのオブジェクトとCANNON-ESのbodyを同時に操作するためのクラス
class BandleObject {
    object;
    body;
    offset;
    isLinked;
    constructor(object, body) {
        this.object = object;
        this.body = body;
        this.offset = new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(0, 0, 0);
    }
    update() {
        if (this.object == null) {
            return;
        }
        if (this.isLinked) {
            this.body.mass = 0;
            this.body.velocity = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Vec3(0, 0, 0);
            this.body.angularVelocity = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Vec3(0, 0, 0);
        }
        else {
            this.body.mass = 1;
        }
        const pos = this.getRotatedPosition();
        this.object.position.set(pos.x, pos.y, pos.z);
        this.object.quaternion.set(this.body.quaternion.x, this.body.quaternion.y, this.body.quaternion.z, this.body.quaternion.w);
    }
    add(scene, world) {
        scene.add(this.object);
        world.addBody(this.body);
    }
    setObject(object) {
        this.object = object;
    }
    setBody(body) {
        this.body = body;
    }
    getObject() {
        return this.object;
    }
    getBody() {
        return this.body;
    }
    setIsLinked(value) {
        this.isLinked = value;
    }
    getRotatedPosition() {
        const quaternion = new three__WEBPACK_IMPORTED_MODULE_2__.Quaternion(this.body.quaternion.x, this.body.quaternion.y, this.body.quaternion.z, this.body.quaternion.w);
        const offsetRotated = this.offset.clone().clone().applyQuaternion(quaternion);
        return new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(this.body.position.x - offsetRotated.x, this.body.position.y - offsetRotated.y, this.body.position.z - offsetRotated.z);
    }
}
class Arm {
    object;
    rightArm;
    leftArm;
    openTween;
    closeTween;
    currentTarget = 0;
    isLinked = false;
    constructor(object) {
        this.object = object;
        for (const child of object.children) {
            if (child.name === "right_arm") {
                this.rightArm = child;
            }
            else if (child.name === "left_arm") {
                this.leftArm = child;
            }
        }
    }
    open() {
        this.openTween.start();
    }
    close() {
        this.closeTween.start();
    }
    move(models, goal) {
        let target = models[this.currentTarget];
        let tweeninfo = { x: this.object.position.x, y: this.object.position.y, z: this.object.position.z, rotation: 0 };
        const update = () => {
            this.object.position.x = tweeninfo.x;
            this.object.position.y = tweeninfo.y;
            this.object.position.z = tweeninfo.z;
            this.rightArm.rotation.z = -tweeninfo.rotation;
            this.leftArm.rotation.z = tweeninfo.rotation;
            if (this.isLinked) {
                target.getBody().position.set(tweeninfo.x, tweeninfo.y - 3, tweeninfo.z);
            }
        };
        const startDistance = getDistanceArray(this.object.position, target.getBody().position);
        const xStartTween = new _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Tween(tweeninfo).to({ x: target.getBody().position.x }, startDistance[0] / 0.01).onUpdate(update);
        const zStartTween = new _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Tween(tweeninfo).to({ z: target.getBody().position.z }, startDistance[2] / 0.01).onUpdate(update);
        const yStartTween = new _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Tween(tweeninfo).to({ y: target.getBody().position.y + 3 }, startDistance[1] / 0.01).onUpdate(update);
        const goalDistance = getDistanceArray(target.getBody().position, goal.clone().setY(20));
        const xGoalTween = new _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Tween(tweeninfo).to({ x: goal.x }, goalDistance[0] / 0.01).onUpdate(update);
        const zGoalTween = new _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Tween(tweeninfo).to({ z: goal.z }, goalDistance[2] / 0.01).onUpdate(update);
        const yGoalTween = new _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Tween(tweeninfo).to({ y: 20 }, goalDistance[1] / 0.01).onUpdate(update);
        const closeTween = new _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Tween(tweeninfo)
            .to({ rotation: Math.PI / 4 }, 500)
            .onUpdate(update)
            .onComplete(() => {
            this.isLinked = true;
            target.setIsLinked(true);
        });
        const openTween = new _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Tween(tweeninfo)
            .to({ rotation: 0 }, 500)
            .onUpdate(update)
            .onComplete(() => {
            this.isLinked = false;
            target.setIsLinked(false);
            this.currentTarget = (this.currentTarget + 1) % models.length;
        });
        xStartTween.chain(zStartTween.delay(1000));
        zStartTween.chain(yStartTween.delay(1000));
        yStartTween.chain(closeTween.delay(500));
        closeTween.chain(yGoalTween.delay(1000));
        yGoalTween.chain(zGoalTween.delay(1000));
        zGoalTween.chain(xGoalTween.delay(1000));
        xGoalTween.chain(openTween.delay(500));
        openTween.chain(new _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Tween(tweeninfo).to({ y: 28 }, 100).onUpdate(update).delay(500));
        xStartTween.start();
    }
    getObject() {
        return this.object;
    }
}
function getBoxBodyFromGeometry(geometry, mass) {
    let min = [Infinity, Infinity, Infinity];
    let max = [-Infinity, -Infinity, -Infinity];
    const vertices = geometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i++) {
        if (vertices[i] < min[i % 3])
            min[i % 3] = vertices[i];
        if (vertices[i] > max[i % 3])
            max[i % 3] = vertices[i];
    }
    // 中心を計算する
    const center = [(max[0] + min[0]) / 2, (max[1] + min[1]) / 2, (max[2] + min[2]) / 2];
    // ハーフエクステントを計算する
    const halfExtents = [(max[0] - min[0]) / 2, (max[1] - min[1]) / 2, (max[2] - min[2]) / 2];
    // CANNON.Boxオブジェクトを作成する
    const halfExtentsVec = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Vec3(halfExtents[0], halfExtents[1], halfExtents[2]);
    const boxShape = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Box(halfExtentsVec);
    // ボディにボックス形状を追加する
    const body = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Body({
        mass: mass,
        shape: boxShape,
        position: new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Vec3(center[0], center[1], center[2]),
    });
    return body;
}
function getDistanceArray(origin, target) {
    return [Math.abs(origin.x - target.x), Math.abs(origin.y - target.y), Math.abs(origin.z - target.z)];
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcgprendering"] = self["webpackChunkcgprendering"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_tweenjs_tween_js_dist_tween_esm_js-node_modules_cannon-es_dist_cannon-es-831615"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QyxDQUFDLENBQUM7UUFFM0YsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFTSxTQUFTO1FBQ1osT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7Q0FDSjtBQUVELFNBQVMsc0JBQXNCLENBQUMsUUFBUSxFQUFFLElBQUk7SUFDMUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3pDLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUU1QyxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7SUFDcEQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDdEMsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2RCxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzFEO0lBRUQsVUFBVTtJQUNWLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUVyRixpQkFBaUI7SUFDakIsTUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBRTFGLHdCQUF3QjtJQUN4QixNQUFNLGNBQWMsR0FBRyxJQUFJLDJDQUFXLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV2RixNQUFNLFFBQVEsR0FBRyxJQUFJLDBDQUFVLENBQUMsY0FBYyxDQUFDLENBQUM7SUFFaEQsa0JBQWtCO0lBQ2xCLE1BQU0sSUFBSSxHQUFHLElBQUksMkNBQVcsQ0FBQztRQUN6QixJQUFJLEVBQUUsSUFBSTtRQUNWLEtBQUssRUFBRSxRQUFRO1FBQ2YsUUFBUSxFQUFFLElBQUksMkNBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUM3RCxDQUFDLENBQUM7SUFFSCxPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDO0FBRUQsU0FBUyxnQkFBZ0IsQ0FBQyxNQUFxQixFQUFFLE1BQXFCO0lBQ2xFLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pHLENBQUM7Ozs7Ozs7VUMzWUQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOzs7OztXQ3pCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLCtCQUErQix3Q0FBd0M7V0FDdkU7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQkFBaUIscUJBQXFCO1dBQ3RDO1dBQ0E7V0FDQSxrQkFBa0IscUJBQXFCO1dBQ3ZDO1dBQ0E7V0FDQSxLQUFLO1dBQ0w7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQzNCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTSxxQkFBcUI7V0FDM0I7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7Ozs7O1VFaERBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvLi9zcmMvYXBwLnRzIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2NodW5rIGxvYWRlZCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBPcmJpdENvbnRyb2xzIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9jb250cm9scy9PcmJpdENvbnRyb2xzXCI7XG5pbXBvcnQgKiBhcyBDQU5OT04gZnJvbSBcImNhbm5vbi1lc1wiO1xuaW1wb3J0ICogYXMgVFdFRU4gZnJvbSBcIkB0d2VlbmpzL3R3ZWVuLmpzXCI7XG5pbXBvcnQgeyBHTFRGTG9hZGVyIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9sb2FkZXJzL0dMVEZMb2FkZXIuanNcIjtcbmltcG9ydCBDYW5ub25EZWJ1Z2dlciBmcm9tIFwiY2Fubm9uLWVzLWRlYnVnZ2VyXCI7XG5cbmNsYXNzIFRocmVlSlNDb250YWluZXIge1xuICAgIHByaXZhdGUgc2NlbmU6IFRIUkVFLlNjZW5lO1xuICAgIHByaXZhdGUgd29ybGQ6IENBTk5PTi5Xb3JsZDtcbiAgICBwcml2YXRlIGxpZ2h0OiBUSFJFRS5MaWdodDtcbiAgICBwcml2YXRlIG1vZGVsczogQmFuZGxlT2JqZWN0W107XG4gICAgcHJpdmF0ZSBhcm06IEFybTtcbiAgICBwcml2YXRlIGdvYWw6IFRIUkVFLlZlY3RvcjM7XG4gICAgcHJpdmF0ZSBzcGF3blF1ZXVlO1xuXG4gICAgY29uc3RydWN0b3IoKSB7fVxuXG4gICAgLy8g55S76Z2i6YOo5YiG44Gu5L2c5oiQKOihqOekuuOBmeOCi+aeoOOBlOOBqOOBqykqXG4gICAgcHVibGljIGNyZWF0ZVJlbmRlcmVyRE9NID0gKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBjYW1lcmFQb3M6IFRIUkVFLlZlY3RvcjMpID0+IHtcbiAgICAgICAgbGV0IHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoKTtcbiAgICAgICAgcmVuZGVyZXIuc2V0U2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgcmVuZGVyZXIuc2V0Q2xlYXJDb2xvcihuZXcgVEhSRUUuQ29sb3IoMHg0OTVlZCkpO1xuXG4gICAgICAgIC8v44Kr44Oh44Op44Gu6Kit5a6aXG4gICAgICAgIGxldCBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNzUsIHdpZHRoIC8gaGVpZ2h0LCAwLjEsIDEwMDApO1xuICAgICAgICBjYW1lcmEucG9zaXRpb24uY29weShjYW1lcmFQb3MpO1xuICAgICAgICBjYW1lcmEubG9va0F0KG5ldyBUSFJFRS5WZWN0b3IzKDAsIDE2LCAwKSk7XG5cbiAgICAgICAgLy8gbGV0IG9yYml0Q29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gICAgICAgIHRoaXMuY3JlYXRlU2NlbmUoKTtcbiAgICAgICAgLy8g5q+O44OV44Os44O844Og44GudXBkYXRl44KS5ZG844KT44Gn77yMcmVuZGVyXG4gICAgICAgIC8vIHJlcWVzdEFuaW1hdGlvbkZyYW1lIOOBq+OCiOOCiuasoeODleODrOODvOODoOOCkuWRvOOBtlxuICAgICAgICBsZXQgcmVuZGVyOiBGcmFtZVJlcXVlc3RDYWxsYmFjayA9ICh0aW1lKSA9PiB7XG4gICAgICAgICAgICAvLyBvcmJpdENvbnRyb2xzLnVwZGF0ZSgpO1xuXG4gICAgICAgICAgICByZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZSwgY2FtZXJhKTtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xuICAgICAgICB9O1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcblxuICAgICAgICByZW5kZXJlci5kb21FbGVtZW50LnN0eWxlLmNzc0Zsb2F0ID0gXCJsZWZ0XCI7XG4gICAgICAgIHJlbmRlcmVyLmRvbUVsZW1lbnQuc3R5bGUubWFyZ2luID0gXCIxMHB4XCI7XG4gICAgICAgIC8vIOODhuOCr+OCueODgeODo+OBruiJsuepuumWk+OBq+WQiOOCj+OBm+OBpuWHuuWKm+OCknNSR0LjgavlpInjgYjjgotcbiAgICAgICAgcmVuZGVyZXIub3V0cHV0RW5jb2RpbmcgPSBUSFJFRS5zUkdCRW5jb2Rpbmc7XG4gICAgICAgIHJldHVybiByZW5kZXJlci5kb21FbGVtZW50O1xuICAgIH07XG5cbiAgICAvLyDjgrfjg7zjg7Pjga7kvZzmiJAo5YWo5L2T44GnMeWbnilcbiAgICBwcml2YXRlIGNyZWF0ZVNjZW5lID0gKCkgPT4ge1xuICAgICAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG4gICAgICAgIHRoaXMud29ybGQgPSBuZXcgQ0FOTk9OLldvcmxkKHsgZ3Jhdml0eTogbmV3IENBTk5PTi5WZWMzKDAsIC05LjgyLCAwKSB9KTtcbiAgICAgICAgdGhpcy53b3JsZC5kZWZhdWx0Q29udGFjdE1hdGVyaWFsLmZyaWN0aW9uID0gMC4xO1xuICAgICAgICB0aGlzLndvcmxkLmRlZmF1bHRDb250YWN0TWF0ZXJpYWwucmVzdGl0dXRpb24gPSAwLjU7XG5cbiAgICAgICAgdGhpcy5zZXR1cFNjZW5lKCk7XG5cbiAgICAgICAgLy8gY29uc3QgY2Fubm9uRGVidWdnZXIgPSBDYW5ub25EZWJ1Z2dlcih0aGlzLnNjZW5lLCB0aGlzLndvcmxkKTtcblxuICAgICAgICBjb25zdCBjbG9jayA9IG5ldyBUSFJFRS5DbG9jaygpO1xuICAgICAgICAvLyDmnIDliJ3jgaDjgZHplovlp4s156eS44Gn44Ki44O844Og44GM5YuV44GP44KI44GG44Gr6Kit5a6aXG4gICAgICAgIGxldCBhcm1UaW1lciA9IDEwO1xuICAgICAgICBsZXQgc3Bhd25UaW1lciA9IDM7XG5cbiAgICAgICAgLy8g5q+O44OV44Os44O844Og44GudXBkYXRl44KS5ZG844KT44Gn77yM5pu05pawXG4gICAgICAgIC8vIHJlcWVzdEFuaW1hdGlvbkZyYW1lIOOBq+OCiOOCiuasoeODleODrOODvOODoOOCkuWRvOOBtlxuICAgICAgICBsZXQgdXBkYXRlOiBGcmFtZVJlcXVlc3RDYWxsYmFjayA9ICh0aW1lKSA9PiB7XG4gICAgICAgICAgICB0aGlzLndvcmxkLmZpeGVkU3RlcCgpO1xuXG4gICAgICAgICAgICBjb25zdCBkZWx0YSA9IGNsb2NrLmdldERlbHRhKCk7XG4gICAgICAgICAgICBzcGF3blRpbWVyICs9IGRlbHRhO1xuICAgICAgICAgICAgYXJtVGltZXIgKz0gZGVsdGE7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmFybSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFybVRpbWVyID4gMTUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcm0ubW92ZSh0aGlzLm1vZGVscywgdGhpcy5nb2FsKTtcbiAgICAgICAgICAgICAgICAgICAgYXJtVGltZXIgPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHNwYXduVGltZXIgPiAyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3Bhd25RdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW9kZWxzW3RoaXMuc3Bhd25RdWV1ZVswXV0uZ2V0Qm9keSgpLnZlbG9jaXR5ID0gbmV3IENBTk5PTi5WZWMzKDAsIDAsIDApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vZGVsc1t0aGlzLnNwYXduUXVldWVbMF1dLmdldEJvZHkoKS5hbmd1bGFyVmVsb2NpdHkgPSBuZXcgQ0FOTk9OLlZlYzMoMCwgMCwgMCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW9kZWxzW3RoaXMuc3Bhd25RdWV1ZVswXV0uZ2V0Qm9keSgpLnBvc2l0aW9uID0gbmV3IENBTk5PTi5WZWMzKChNYXRoLnJhbmRvbSgpICogMiAtIDEpICogOCwgMjAsIChNYXRoLnJhbmRvbSgpICogMiAtIDEpICogOCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW9kZWxzW3RoaXMuc3Bhd25RdWV1ZVswXV0uZ2V0Qm9keSgpLnF1YXRlcm5pb24gPSBuZXcgQ0FOTk9OLlF1YXRlcm5pb24oKS5zZXRGcm9tRXVsZXIoTWF0aC5yYW5kb20oKSwgTWF0aC5yYW5kb20oKSwgTWF0aC5yYW5kb20oKSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3Bhd25RdWV1ZS5zcGxpY2UoMCwgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNwYXduVGltZXIgPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLm1vZGVscykge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1vZGVsID0gdGhpcy5tb2RlbHNba2V5XTtcbiAgICAgICAgICAgICAgICBpZiAobW9kZWwgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbW9kZWwudXBkYXRlKCk7XG4gICAgICAgICAgICAgICAgaWYgKG1vZGVsLmdldEJvZHkoKS5wb3NpdGlvbi55IDwgLTE1KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5zcGF3blF1ZXVlLmluY2x1ZGVzKGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3Bhd25RdWV1ZS5wdXNoKGtleSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGNhbm5vbkRlYnVnZ2VyLnVwZGF0ZSgpO1xuXG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlKTtcbiAgICAgICAgICAgIFRXRUVOLnVwZGF0ZSgpOyAvL+i/veWKoOWIhlxuICAgICAgICB9O1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlKTtcbiAgICB9O1xuXG4gICAgLy8g44K344O844Oz44Gu5L2c5oiQKOWFqOS9k+OBpzHlm54pXG4gICAgcHJpdmF0ZSBzZXR1cFNjZW5lID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICAvL+ODqeOCpOODiOOBruioreWumlxuICAgICAgICB0aGlzLmxpZ2h0ID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYpO1xuICAgICAgICBsZXQgbHZlYyA9IG5ldyBUSFJFRS5WZWN0b3IzKDEsIDEsIDEpLm5vcm1hbGl6ZSgpO1xuICAgICAgICB0aGlzLmxpZ2h0LnBvc2l0aW9uLnNldChsdmVjLngsIGx2ZWMueSwgbHZlYy56KTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQodGhpcy5saWdodCk7XG5cbiAgICAgICAgYXdhaXQgbmV3IEdMVEZMb2FkZXIoKS5sb2FkKFwiYXJtLmdsdGZcIiwgKGRhdGEpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsID0gZGF0YS5zY2VuZTtcbiAgICAgICAgICAgIG1vZGVsLnBvc2l0aW9uLnkgPSAyODtcbiAgICAgICAgICAgIHRoaXMuYXJtID0gbmV3IEFybShtb2RlbCk7XG4gICAgICAgICAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLmFybS5nZXRPYmplY3QoKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGF3YWl0IG5ldyBHTFRGTG9hZGVyKCkubG9hZChcImZyYW1lLmdsdGZcIiwgKGRhdGEpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG1vZGVsID0gZGF0YS5zY2VuZTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgbW9kZWwuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGQubmFtZS5zZWFyY2goL2NvbF8uKy8pID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYm9keSA9IGdldEJveEJvZHlGcm9tR2VvbWV0cnkoKGNoaWxkIGFzIFRIUkVFLk1lc2gpLmdlb21ldHJ5LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53b3JsZC5hZGRCb2R5KGJvZHkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2hpbGQubmFtZS5zZWFyY2goL2dvYWwvKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ29hbCA9IGNoaWxkLnBvc2l0aW9uO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2NlbmUuYWRkKG1vZGVsKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8g6YCP5piO44Gq44OR44ON44OrXG4gICAgICAgIGNvbnN0IHBsYW5lU2hhcGUgPSBuZXcgQ0FOTk9OLlBsYW5lKCk7XG4gICAgICAgIGNvbnN0IHBsYW5lQm9keSA9IG5ldyBDQU5OT04uQm9keSh7IG1hc3M6IDAgfSk7XG4gICAgICAgIHBsYW5lQm9keS5hZGRTaGFwZShwbGFuZVNoYXBlKTtcbiAgICAgICAgcGxhbmVCb2R5LnBvc2l0aW9uLnNldCgwLCAxMCwgMTApO1xuICAgICAgICBwbGFuZUJvZHkucXVhdGVybmlvbiA9IG5ldyBDQU5OT04uUXVhdGVybmlvbigpLnNldEZyb21FdWxlcigwLCBNYXRoLlBJLCAwKTtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRCb2R5KHBsYW5lQm9keSk7XG5cbiAgICAgICAgdGhpcy5tb2RlbHMgPSBbXTtcbiAgICAgICAgdGhpcy5zcGF3blF1ZXVlID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IDMwOyBpbmRleCsrKSB7XG4gICAgICAgICAgICBjb25zdCBkZWZhdWx0UG9zaXRpb24gPSBuZXcgQ0FOTk9OLlZlYzMoKE1hdGgucmFuZG9tKCkgKiAyIC0gMSkgKiAxMCwgMjAsIChNYXRoLnJhbmRvbSgpICogMiAtIDEpICogMTApO1xuICAgICAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPiAwLjUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzaGFwZSA9IG5ldyBDQU5OT04uQm94KG5ldyBDQU5OT04uVmVjMygxLCAyLjcsIDEpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQmFuZGxlT2JqZWN0KFxuICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICBuZXcgQ0FOTk9OLkJvZHkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFzczogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYXBlOiBzaGFwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBkZWZhdWx0UG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBxdWF0ZXJuaW9uOiBuZXcgQ0FOTk9OLlF1YXRlcm5pb24oKS5zZXRGcm9tRXVsZXIoTWF0aC5yYW5kb20oKSwgTWF0aC5yYW5kb20oKSwgTWF0aC5yYW5kb20oKSksXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBvYmoub2Zmc2V0LnkgPSAyLjc7XG4gICAgICAgICAgICAgICAgbmV3IEdMVEZMb2FkZXIoKS5sb2FkKFwiY2hhcmFjdGVyX21vZGVsLmdsdGZcIiwgKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbW9kZWwgPSBkYXRhLnNjZW5lO1xuICAgICAgICAgICAgICAgICAgICBtb2RlbC5zY2FsZS54ID0gMC4yNTtcbiAgICAgICAgICAgICAgICAgICAgbW9kZWwuc2NhbGUueSA9IDAuMjU7XG4gICAgICAgICAgICAgICAgICAgIG1vZGVsLnNjYWxlLnogPSAwLjI1O1xuICAgICAgICAgICAgICAgICAgICBvYmouc2V0T2JqZWN0KG1vZGVsKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5hZGQobW9kZWwpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMubW9kZWxzLnB1c2gob2JqKTtcbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkLmFkZEJvZHkob2JqLmdldEJvZHkoKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNoYXBlID0gbmV3IENBTk5PTi5Cb3gobmV3IENBTk5PTi5WZWMzKDEsIDEsIDEpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQmFuZGxlT2JqZWN0KFxuICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICBuZXcgQ0FOTk9OLkJvZHkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFzczogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYXBlOiBzaGFwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBkZWZhdWx0UG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBxdWF0ZXJuaW9uOiBuZXcgQ0FOTk9OLlF1YXRlcm5pb24oKS5zZXRGcm9tRXVsZXIoTWF0aC5yYW5kb20oKSwgTWF0aC5yYW5kb20oKSwgTWF0aC5yYW5kb20oKSksXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBuZXcgR0xURkxvYWRlcigpLmxvYWQoXCJzb2ZrZW4uZ2x0ZlwiLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtb2RlbCA9IGRhdGEuc2NlbmU7XG4gICAgICAgICAgICAgICAgICAgIG1vZGVsLnNjYWxlLnggPSAwLjU7XG4gICAgICAgICAgICAgICAgICAgIG1vZGVsLnNjYWxlLnkgPSAwLjU7XG4gICAgICAgICAgICAgICAgICAgIG1vZGVsLnNjYWxlLnogPSAwLjU7XG4gICAgICAgICAgICAgICAgICAgIG9iai5zZXRPYmplY3QobW9kZWwpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLmFkZChtb2RlbCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RlbHMucHVzaChvYmopO1xuICAgICAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQm9keShvYmouZ2V0Qm9keSgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBpbml0KTtcblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBsZXQgY29udGFpbmVyID0gbmV3IFRocmVlSlNDb250YWluZXIoKTtcblxuICAgIGxldCB2aWV3cG9ydCA9IGNvbnRhaW5lci5jcmVhdGVSZW5kZXJlckRPTSg2NDAsIDQ4MCwgbmV3IFRIUkVFLlZlY3RvcjMoMCwgMTYsIDE2KSk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh2aWV3cG9ydCk7XG59XG5cbi8vIFRKU+OBruOCquODluOCuOOCp+OCr+ODiOOBqENBTk5PTi1FU+OBrmJvZHnjgpLlkIzmmYLjgavmk43kvZzjgZnjgovjgZ/jgoHjga7jgq/jg6njgrlcbmNsYXNzIEJhbmRsZU9iamVjdCB7XG4gICAgcHJpdmF0ZSBvYmplY3Q6IFRIUkVFLk9iamVjdDNEO1xuICAgIHByaXZhdGUgYm9keTogQ0FOTk9OLkJvZHk7XG5cbiAgICBwdWJsaWMgb2Zmc2V0OiBUSFJFRS5WZWN0b3IzO1xuICAgIHByaXZhdGUgaXNMaW5rZWQ6IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcihvYmplY3Q6IFRIUkVFLk9iamVjdDNELCBib2R5OiBDQU5OT04uQm9keSkge1xuICAgICAgICB0aGlzLm9iamVjdCA9IG9iamVjdDtcbiAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcbiAgICAgICAgdGhpcy5vZmZzZXQgPSBuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAwKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdXBkYXRlKCkge1xuICAgICAgICBpZiAodGhpcy5vYmplY3QgPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNMaW5rZWQpIHtcbiAgICAgICAgICAgIHRoaXMuYm9keS5tYXNzID0gMDtcbiAgICAgICAgICAgIHRoaXMuYm9keS52ZWxvY2l0eSA9IG5ldyBDQU5OT04uVmVjMygwLCAwLCAwKTtcbiAgICAgICAgICAgIHRoaXMuYm9keS5hbmd1bGFyVmVsb2NpdHkgPSBuZXcgQ0FOTk9OLlZlYzMoMCwgMCwgMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmJvZHkubWFzcyA9IDE7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwb3MgPSB0aGlzLmdldFJvdGF0ZWRQb3NpdGlvbigpO1xuICAgICAgICB0aGlzLm9iamVjdC5wb3NpdGlvbi5zZXQocG9zLngsIHBvcy55LCBwb3Mueik7XG4gICAgICAgIHRoaXMub2JqZWN0LnF1YXRlcm5pb24uc2V0KHRoaXMuYm9keS5xdWF0ZXJuaW9uLngsIHRoaXMuYm9keS5xdWF0ZXJuaW9uLnksIHRoaXMuYm9keS5xdWF0ZXJuaW9uLnosIHRoaXMuYm9keS5xdWF0ZXJuaW9uLncpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhZGQoc2NlbmU6IFRIUkVFLlNjZW5lLCB3b3JsZDogQ0FOTk9OLldvcmxkKSB7XG4gICAgICAgIHNjZW5lLmFkZCh0aGlzLm9iamVjdCk7XG4gICAgICAgIHdvcmxkLmFkZEJvZHkodGhpcy5ib2R5KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0T2JqZWN0KG9iamVjdCkge1xuICAgICAgICB0aGlzLm9iamVjdCA9IG9iamVjdDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0Qm9keShib2R5KSB7XG4gICAgICAgIHRoaXMuYm9keSA9IGJvZHk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldE9iamVjdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub2JqZWN0O1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRCb2R5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ib2R5O1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRJc0xpbmtlZCh2YWx1ZSkge1xuICAgICAgICB0aGlzLmlzTGlua2VkID0gdmFsdWU7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFJvdGF0ZWRQb3NpdGlvbigpIHtcbiAgICAgICAgY29uc3QgcXVhdGVybmlvbiA9IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKHRoaXMuYm9keS5xdWF0ZXJuaW9uLngsIHRoaXMuYm9keS5xdWF0ZXJuaW9uLnksIHRoaXMuYm9keS5xdWF0ZXJuaW9uLnosIHRoaXMuYm9keS5xdWF0ZXJuaW9uLncpO1xuICAgICAgICBjb25zdCBvZmZzZXRSb3RhdGVkID0gdGhpcy5vZmZzZXQuY2xvbmUoKS5hcHBseVF1YXRlcm5pb24ocXVhdGVybmlvbik7XG4gICAgICAgIHJldHVybiBuZXcgVEhSRUUuVmVjdG9yMyh0aGlzLmJvZHkucG9zaXRpb24ueCAtIG9mZnNldFJvdGF0ZWQueCwgdGhpcy5ib2R5LnBvc2l0aW9uLnkgLSBvZmZzZXRSb3RhdGVkLnksIHRoaXMuYm9keS5wb3NpdGlvbi56IC0gb2Zmc2V0Um90YXRlZC56KTtcbiAgICB9XG59XG5cbmNsYXNzIEFybSB7XG4gICAgcHJpdmF0ZSBvYmplY3Q6IFRIUkVFLkdyb3VwO1xuICAgIHByaXZhdGUgcmlnaHRBcm07XG4gICAgcHJpdmF0ZSBsZWZ0QXJtO1xuICAgIHByaXZhdGUgb3BlblR3ZWVuO1xuICAgIHByaXZhdGUgY2xvc2VUd2VlbjtcbiAgICBwcml2YXRlIGN1cnJlbnRUYXJnZXQgPSAwO1xuICAgIHByaXZhdGUgaXNMaW5rZWQgPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKG9iamVjdCkge1xuICAgICAgICB0aGlzLm9iamVjdCA9IG9iamVjdDtcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBvYmplY3QuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIGlmIChjaGlsZC5uYW1lID09PSBcInJpZ2h0X2FybVwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yaWdodEFybSA9IGNoaWxkO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjaGlsZC5uYW1lID09PSBcImxlZnRfYXJtXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxlZnRBcm0gPSBjaGlsZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBvcGVuKCkge1xuICAgICAgICB0aGlzLm9wZW5Ud2Vlbi5zdGFydCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBjbG9zZSgpIHtcbiAgICAgICAgdGhpcy5jbG9zZVR3ZWVuLnN0YXJ0KCk7XG4gICAgfVxuXG4gICAgcHVibGljIG1vdmUobW9kZWxzLCBnb2FsKSB7XG4gICAgICAgIGxldCB0YXJnZXQgPSBtb2RlbHNbdGhpcy5jdXJyZW50VGFyZ2V0XTtcbiAgICAgICAgbGV0IHR3ZWVuaW5mbyA9IHsgeDogdGhpcy5vYmplY3QucG9zaXRpb24ueCwgeTogdGhpcy5vYmplY3QucG9zaXRpb24ueSwgejogdGhpcy5vYmplY3QucG9zaXRpb24ueiwgcm90YXRpb246IDAgfTtcbiAgICAgICAgY29uc3QgdXBkYXRlID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vYmplY3QucG9zaXRpb24ueCA9IHR3ZWVuaW5mby54O1xuICAgICAgICAgICAgdGhpcy5vYmplY3QucG9zaXRpb24ueSA9IHR3ZWVuaW5mby55O1xuICAgICAgICAgICAgdGhpcy5vYmplY3QucG9zaXRpb24ueiA9IHR3ZWVuaW5mby56O1xuICAgICAgICAgICAgdGhpcy5yaWdodEFybS5yb3RhdGlvbi56ID0gLXR3ZWVuaW5mby5yb3RhdGlvbjtcbiAgICAgICAgICAgIHRoaXMubGVmdEFybS5yb3RhdGlvbi56ID0gdHdlZW5pbmZvLnJvdGF0aW9uO1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNMaW5rZWQpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXQuZ2V0Qm9keSgpLnBvc2l0aW9uLnNldCh0d2VlbmluZm8ueCwgdHdlZW5pbmZvLnkgLSAzLCB0d2VlbmluZm8ueik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgc3RhcnREaXN0YW5jZSA9IGdldERpc3RhbmNlQXJyYXkodGhpcy5vYmplY3QucG9zaXRpb24sIHRhcmdldC5nZXRCb2R5KCkucG9zaXRpb24pO1xuICAgICAgICBjb25zdCB4U3RhcnRUd2VlbiA9IG5ldyBUV0VFTi5Ud2Vlbih0d2VlbmluZm8pLnRvKHsgeDogdGFyZ2V0LmdldEJvZHkoKS5wb3NpdGlvbi54IH0sIHN0YXJ0RGlzdGFuY2VbMF0gLyAwLjAxKS5vblVwZGF0ZSh1cGRhdGUpO1xuICAgICAgICBjb25zdCB6U3RhcnRUd2VlbiA9IG5ldyBUV0VFTi5Ud2Vlbih0d2VlbmluZm8pLnRvKHsgejogdGFyZ2V0LmdldEJvZHkoKS5wb3NpdGlvbi56IH0sIHN0YXJ0RGlzdGFuY2VbMl0gLyAwLjAxKS5vblVwZGF0ZSh1cGRhdGUpO1xuICAgICAgICBjb25zdCB5U3RhcnRUd2VlbiA9IG5ldyBUV0VFTi5Ud2Vlbih0d2VlbmluZm8pLnRvKHsgeTogdGFyZ2V0LmdldEJvZHkoKS5wb3NpdGlvbi55ICsgMyB9LCBzdGFydERpc3RhbmNlWzFdIC8gMC4wMSkub25VcGRhdGUodXBkYXRlKTtcblxuICAgICAgICBjb25zdCBnb2FsRGlzdGFuY2UgPSBnZXREaXN0YW5jZUFycmF5KHRhcmdldC5nZXRCb2R5KCkucG9zaXRpb24sIGdvYWwuY2xvbmUoKS5zZXRZKDIwKSk7XG4gICAgICAgIGNvbnN0IHhHb2FsVHdlZW4gPSBuZXcgVFdFRU4uVHdlZW4odHdlZW5pbmZvKS50byh7IHg6IGdvYWwueCB9LCBnb2FsRGlzdGFuY2VbMF0gLyAwLjAxKS5vblVwZGF0ZSh1cGRhdGUpO1xuICAgICAgICBjb25zdCB6R29hbFR3ZWVuID0gbmV3IFRXRUVOLlR3ZWVuKHR3ZWVuaW5mbykudG8oeyB6OiBnb2FsLnogfSwgZ29hbERpc3RhbmNlWzJdIC8gMC4wMSkub25VcGRhdGUodXBkYXRlKTtcbiAgICAgICAgY29uc3QgeUdvYWxUd2VlbiA9IG5ldyBUV0VFTi5Ud2Vlbih0d2VlbmluZm8pLnRvKHsgeTogMjAgfSwgZ29hbERpc3RhbmNlWzFdIC8gMC4wMSkub25VcGRhdGUodXBkYXRlKTtcblxuICAgICAgICBjb25zdCBjbG9zZVR3ZWVuID0gbmV3IFRXRUVOLlR3ZWVuKHR3ZWVuaW5mbylcbiAgICAgICAgICAgIC50byh7IHJvdGF0aW9uOiBNYXRoLlBJIC8gNCB9LCA1MDApXG4gICAgICAgICAgICAub25VcGRhdGUodXBkYXRlKVxuICAgICAgICAgICAgLm9uQ29tcGxldGUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNMaW5rZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRhcmdldC5zZXRJc0xpbmtlZCh0cnVlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IG9wZW5Ud2VlbiA9IG5ldyBUV0VFTi5Ud2Vlbih0d2VlbmluZm8pXG4gICAgICAgICAgICAudG8oeyByb3RhdGlvbjogMCB9LCA1MDApXG4gICAgICAgICAgICAub25VcGRhdGUodXBkYXRlKVxuICAgICAgICAgICAgLm9uQ29tcGxldGUoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNMaW5rZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0YXJnZXQuc2V0SXNMaW5rZWQoZmFsc2UpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFRhcmdldCA9ICh0aGlzLmN1cnJlbnRUYXJnZXQgKyAxKSAlIG1vZGVscy5sZW5ndGg7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB4U3RhcnRUd2Vlbi5jaGFpbih6U3RhcnRUd2Vlbi5kZWxheSgxMDAwKSk7XG4gICAgICAgIHpTdGFydFR3ZWVuLmNoYWluKHlTdGFydFR3ZWVuLmRlbGF5KDEwMDApKTtcbiAgICAgICAgeVN0YXJ0VHdlZW4uY2hhaW4oY2xvc2VUd2Vlbi5kZWxheSg1MDApKTtcbiAgICAgICAgY2xvc2VUd2Vlbi5jaGFpbih5R29hbFR3ZWVuLmRlbGF5KDEwMDApKTtcbiAgICAgICAgeUdvYWxUd2Vlbi5jaGFpbih6R29hbFR3ZWVuLmRlbGF5KDEwMDApKTtcbiAgICAgICAgekdvYWxUd2Vlbi5jaGFpbih4R29hbFR3ZWVuLmRlbGF5KDEwMDApKTtcbiAgICAgICAgeEdvYWxUd2Vlbi5jaGFpbihvcGVuVHdlZW4uZGVsYXkoNTAwKSk7XG5cbiAgICAgICAgb3BlblR3ZWVuLmNoYWluKG5ldyBUV0VFTi5Ud2Vlbih0d2VlbmluZm8pLnRvKHsgeTogMjggfSwgMTAwKS5vblVwZGF0ZSh1cGRhdGUpLmRlbGF5KDUwMCkpO1xuXG4gICAgICAgIHhTdGFydFR3ZWVuLnN0YXJ0KCk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldE9iamVjdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub2JqZWN0O1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2V0Qm94Qm9keUZyb21HZW9tZXRyeShnZW9tZXRyeSwgbWFzcykge1xuICAgIGxldCBtaW4gPSBbSW5maW5pdHksIEluZmluaXR5LCBJbmZpbml0eV07XG4gICAgbGV0IG1heCA9IFstSW5maW5pdHksIC1JbmZpbml0eSwgLUluZmluaXR5XTtcblxuICAgIGNvbnN0IHZlcnRpY2VzID0gZ2VvbWV0cnkuYXR0cmlidXRlcy5wb3NpdGlvbi5hcnJheTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh2ZXJ0aWNlc1tpXSA8IG1pbltpICUgM10pIG1pbltpICUgM10gPSB2ZXJ0aWNlc1tpXTtcbiAgICAgICAgaWYgKHZlcnRpY2VzW2ldID4gbWF4W2kgJSAzXSkgbWF4W2kgJSAzXSA9IHZlcnRpY2VzW2ldO1xuICAgIH1cblxuICAgIC8vIOS4reW/g+OCkuioiOeul+OBmeOCi1xuICAgIGNvbnN0IGNlbnRlciA9IFsobWF4WzBdICsgbWluWzBdKSAvIDIsIChtYXhbMV0gKyBtaW5bMV0pIC8gMiwgKG1heFsyXSArIG1pblsyXSkgLyAyXTtcblxuICAgIC8vIOODj+ODvOODleOCqOOCr+OCueODhuODs+ODiOOCkuioiOeul+OBmeOCi1xuICAgIGNvbnN0IGhhbGZFeHRlbnRzID0gWyhtYXhbMF0gLSBtaW5bMF0pIC8gMiwgKG1heFsxXSAtIG1pblsxXSkgLyAyLCAobWF4WzJdIC0gbWluWzJdKSAvIDJdO1xuXG4gICAgLy8gQ0FOTk9OLkJveOOCquODluOCuOOCp+OCr+ODiOOCkuS9nOaIkOOBmeOCi1xuICAgIGNvbnN0IGhhbGZFeHRlbnRzVmVjID0gbmV3IENBTk5PTi5WZWMzKGhhbGZFeHRlbnRzWzBdLCBoYWxmRXh0ZW50c1sxXSwgaGFsZkV4dGVudHNbMl0pO1xuXG4gICAgY29uc3QgYm94U2hhcGUgPSBuZXcgQ0FOTk9OLkJveChoYWxmRXh0ZW50c1ZlYyk7XG5cbiAgICAvLyDjg5zjg4fjgqPjgavjg5zjg4Pjgq/jgrnlvaLnirbjgpLov73liqDjgZnjgotcbiAgICBjb25zdCBib2R5ID0gbmV3IENBTk5PTi5Cb2R5KHtcbiAgICAgICAgbWFzczogbWFzcyxcbiAgICAgICAgc2hhcGU6IGJveFNoYXBlLFxuICAgICAgICBwb3NpdGlvbjogbmV3IENBTk5PTi5WZWMzKGNlbnRlclswXSwgY2VudGVyWzFdLCBjZW50ZXJbMl0pLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGJvZHk7XG59XG5cbmZ1bmN0aW9uIGdldERpc3RhbmNlQXJyYXkob3JpZ2luOiBUSFJFRS5WZWN0b3IzLCB0YXJnZXQ6IFRIUkVFLlZlY3RvcjMpIHtcbiAgICByZXR1cm4gW01hdGguYWJzKG9yaWdpbi54IC0gdGFyZ2V0LngpLCBNYXRoLmFicyhvcmlnaW4ueSAtIHRhcmdldC55KSwgTWF0aC5hYnMob3JpZ2luLnogLSB0YXJnZXQueildO1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCJ2YXIgZGVmZXJyZWQgPSBbXTtcbl9fd2VicGFja19yZXF1aXJlX18uTyA9IChyZXN1bHQsIGNodW5rSWRzLCBmbiwgcHJpb3JpdHkpID0+IHtcblx0aWYoY2h1bmtJZHMpIHtcblx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0Zm9yKHZhciBpID0gZGVmZXJyZWQubGVuZ3RoOyBpID4gMCAmJiBkZWZlcnJlZFtpIC0gMV1bMl0gPiBwcmlvcml0eTsgaS0tKSBkZWZlcnJlZFtpXSA9IGRlZmVycmVkW2kgLSAxXTtcblx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRlZmVycmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIFtjaHVua0lkcywgZm4sIHByaW9yaXR5XSA9IGRlZmVycmVkW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2h1bmtJZHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdGlmICgocHJpb3JpdHkgJiAxID09PSAwIHx8IG5vdEZ1bGZpbGxlZCA+PSBwcmlvcml0eSkgJiYgT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5PKS5ldmVyeSgoa2V5KSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXy5PW2tleV0oY2h1bmtJZHNbal0pKSkpIHtcblx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihmdWxmaWxsZWQpIHtcblx0XHRcdGRlZmVycmVkLnNwbGljZShpLS0sIDEpXG5cdFx0XHR2YXIgciA9IGZuKCk7XG5cdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwibWFpblwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRpZihjaHVua0lkcy5zb21lKChpZCkgPT4gKGluc3RhbGxlZENodW5rc1tpZF0gIT09IDApKSkge1xuXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdH1cblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtjZ3ByZW5kZXJpbmdcIl0gPSBzZWxmW1wid2VicGFja0NodW5rY2dwcmVuZGVyaW5nXCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJ2ZW5kb3JzLW5vZGVfbW9kdWxlc190d2VlbmpzX3R3ZWVuX2pzX2Rpc3RfdHdlZW5fZXNtX2pzLW5vZGVfbW9kdWxlc19jYW5ub24tZXNfZGlzdF9jYW5ub24tZXMtODMxNjE1XCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2FwcC50c1wiKSkpXG5fX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKF9fd2VicGFja19leHBvcnRzX18pO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9