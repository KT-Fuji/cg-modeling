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
        // レポート用画像撮影用
        // let orbitControls = new OrbitControls(camera, renderer.domElement);
        this.createScene();
        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        let render = (time) => {
            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
            // orbitControls.update();
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
        // 動作検証用デバッガー
        // const cannonDebugger = CannonDebugger(this.scene, this.world, {color: 0xff0000});
        this.setupScene();
        const clock = new three__WEBPACK_IMPORTED_MODULE_2__.Clock();
        // 最初だけ開始5秒でアームが動くように設定
        let armTimer = 11;
        let spawnTimer = 3;
        // 毎フレームのupdateを呼んで，更新
        // reqestAnimationFrame により次フレームを呼ぶ
        let update = (time) => {
            this.world.fixedStep();
            const delta = clock.getDelta();
            spawnTimer += delta;
            armTimer += delta;
            // アームを動かす
            if (this.arm != null) {
                if (armTimer > 16) {
                    this.arm.move(this.models, this.goal);
                    armTimer = 0;
                }
            }
            // 落下したモデルを2秒ごとに復活させる
            if (spawnTimer > 2) {
                if (this.spawnQueue.length > 0) {
                    // モデルの速度と回転をリセットする
                    this.models[this.spawnQueue[0]].getBody().velocity = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Vec3(0, 0, 0);
                    this.models[this.spawnQueue[0]].getBody().angularVelocity = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Vec3(0, 0, 0);
                    // モデルの初期化
                    this.models[this.spawnQueue[0]].getBody().position = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Vec3((Math.random() * 2 - 1) * 8, 20, (Math.random() * 2 - 1) * 8);
                    this.models[this.spawnQueue[0]].getBody().quaternion = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Quaternion().setFromEuler(Math.random(), Math.random(), Math.random());
                    this.spawnQueue.splice(0, 1);
                }
                spawnTimer = 0;
            }
            // 全てのモデルに対して更新処理を行う
            for (const key in this.models) {
                const model = this.models[key];
                if (model == null) {
                    continue;
                }
                model.update();
                // モデルが落下したら復活キューにいれる
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
        const light1 = new three__WEBPACK_IMPORTED_MODULE_2__.DirectionalLight(0xaaaaaa);
        let lvec = new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(1, 1, 1).clone().normalize();
        light1.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(light1);
        const light2 = new three__WEBPACK_IMPORTED_MODULE_2__.PointLight(0x505050);
        light2.position.set(0, 30, 0);
        this.scene.add(light2);
        // 読み込みに時間がかかるため非同期で処理する
        await new three_examples_jsm_loaders_GLTFLoader_js__WEBPACK_IMPORTED_MODULE_1__.GLTFLoader().load("arm.gltf", (data) => {
            const model = data.scene;
            model.position.y = 28;
            this.arm = new Arm(model);
            this.scene.add(this.arm.getObject());
        });
        await new three_examples_jsm_loaders_GLTFLoader_js__WEBPACK_IMPORTED_MODULE_1__.GLTFLoader().load("frame.gltf", (data) => {
            const model = data.scene;
            for (const child of model.children) {
                // 名前がcolから始まるメッシュに対して当たり判定をつける
                if (child.name.search(/col_.+/) > -1) {
                    const body = getBoxBodyFromGeometry(child.geometry, 0);
                    this.world.addBody(body);
                }
                else if (child.name.search(/goal/) > -1) {
                    // 落下地点を設定する用のオブジェクトから座標を取得する
                    this.goal = child.position;
                }
            }
            this.scene.add(model);
        });
        // 正面の透明なパネル
        const planeShape = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Plane();
        const planeBody = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Body({ mass: 0 });
        planeBody.addShape(planeShape);
        planeBody.position.set(0, 10, 10);
        planeBody.quaternion = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Quaternion().setFromEuler(0, Math.PI, 0);
        this.world.addBody(planeBody);
        this.models = [];
        this.spawnQueue = [];
        // モデルを生成する。
        for (let index = 0; index < 30; index++) {
            const defaultPosition = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Vec3((Math.random() * 2 - 1) * 10, 20, (Math.random() * 2 - 1) * 10);
            // 1/2の確率でモデルが切り替わる
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
// TJSのオブジェクトとcannon-esのbodyを同時に操作するためのクラス
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
    // 更新処理
    update() {
        if (this.object == null) {
            return;
        }
        // アームに掴まれているときは動かないようにする
        if (this.isLinked) {
            this.body.mass = 0;
            this.body.velocity = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Vec3(0, 0, 0);
            this.body.angularVelocity = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Vec3(0, 0, 0);
        }
        else {
            this.body.mass = 1;
        }
        // TJSのオブジェクトとcannon-esのBodyのずれを補正した座標
        const pos = this.getRotatedPosition();
        this.object.position.set(pos.x, pos.y, pos.z);
        this.object.quaternion.set(this.body.quaternion.x, this.body.quaternion.y, this.body.quaternion.z, this.body.quaternion.w);
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
// アームのクラス
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
    move(models, goal) {
        let target = models[this.currentTarget];
        let tweeninfo = { x: this.object.position.x, y: this.object.position.y, z: this.object.position.z, rotation: 0 };
        const update = () => {
            this.object.position.x = tweeninfo.x;
            this.object.position.y = tweeninfo.y;
            this.object.position.z = tweeninfo.z;
            this.rightArm.rotation.z = -tweeninfo.rotation;
            this.leftArm.rotation.z = tweeninfo.rotation;
            // 掴んでいる間はモデルと座標を同期する
            if (this.isLinked) {
                target.getBody().position.set(tweeninfo.x, tweeninfo.y - 3, tweeninfo.z);
            }
        };
        // Tweenの設定
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
            .easing(_tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Easing.Elastic.Out) // 勢い良く離している感を出すためにここだけイージング
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
        // 落とした後最初の高さに戻る
        openTween.chain(new _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_0__.Tween(tweeninfo).to({ y: 28 }, 200).onUpdate(update).delay(400));
        xStartTween.start();
    }
    getObject() {
        return this.object;
    }
}
// 頂点からBodyを生成する
function getBoxBodyFromGeometry(geometry, mass) {
    let min = [Infinity, Infinity, Infinity];
    let max = [-Infinity, -Infinity, -Infinity];
    // 隅の頂点を得る
    const vertices = geometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i++) {
        if (vertices[i] < min[i % 3])
            min[i % 3] = vertices[i];
        if (vertices[i] > max[i % 3])
            max[i % 3] = vertices[i];
    }
    // shapeの作成
    const size = [(max[0] - min[0]) / 2, (max[1] - min[1]) / 2, (max[2] - min[2]) / 2];
    const boxShape = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Vec3(size[0], size[1], size[2]));
    // bodyの作成
    const center = [(max[0] + min[0]) / 2, (max[1] + min[1]) / 2, (max[2] + min[2]) / 2];
    const body = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Body({
        mass: mass,
        shape: boxShape,
        position: new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Vec3(center[0], center[1], center[2]),
    });
    return body;
}
// ベクトルの軸ごとの距離を返す
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nLy4vc3JjL2FwcC50cyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0ICogYXMgQ0FOTk9OIGZyb20gXCJjYW5ub24tZXNcIjtcbmltcG9ydCAqIGFzIFRXRUVOIGZyb20gXCJAdHdlZW5qcy90d2Vlbi5qc1wiO1xuaW1wb3J0IHsgR0xURkxvYWRlciB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vbG9hZGVycy9HTFRGTG9hZGVyLmpzXCI7XG5pbXBvcnQgQ2Fubm9uRGVidWdnZXIgZnJvbSBcImNhbm5vbi1lcy1kZWJ1Z2dlclwiO1xuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9sc1wiO1xuXG5jbGFzcyBUaHJlZUpTQ29udGFpbmVyIHtcbiAgICBwcml2YXRlIHNjZW5lOiBUSFJFRS5TY2VuZTtcbiAgICBwcml2YXRlIHdvcmxkOiBDQU5OT04uV29ybGQ7XG4gICAgcHJpdmF0ZSBtb2RlbHM6IEJhbmRsZU9iamVjdFtdO1xuICAgIHByaXZhdGUgYXJtOiBBcm07XG4gICAgcHJpdmF0ZSBnb2FsOiBUSFJFRS5WZWN0b3IzO1xuICAgIHByaXZhdGUgc3Bhd25RdWV1ZTtcblxuICAgIGNvbnN0cnVjdG9yKCkge31cblxuICAgIC8vIOeUu+mdoumDqOWIhuOBruS9nOaIkCjooajnpLrjgZnjgovmnqDjgZTjgajjgaspKlxuICAgIHB1YmxpYyBjcmVhdGVSZW5kZXJlckRPTSA9ICh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgY2FtZXJhUG9zOiBUSFJFRS5WZWN0b3IzKSA9PiB7XG4gICAgICAgIGxldCByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKCk7XG4gICAgICAgIHJlbmRlcmVyLnNldFNpemUod2lkdGgsIGhlaWdodCk7XG4gICAgICAgIHJlbmRlcmVyLnNldENsZWFyQ29sb3IobmV3IFRIUkVFLkNvbG9yKDB4NDk1ZWQpKTtcblxuICAgICAgICAvL+OCq+ODoeODqeOBruioreWumlxuICAgICAgICBsZXQgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB3aWR0aCAvIGhlaWdodCwgMC4xLCAxMDAwKTtcbiAgICAgICAgY2FtZXJhLnBvc2l0aW9uLmNvcHkoY2FtZXJhUG9zKTtcbiAgICAgICAgY2FtZXJhLmxvb2tBdChuZXcgVEhSRUUuVmVjdG9yMygwLCAxNiwgMCkpO1xuXG4gICAgICAgIC8vIOODrOODneODvOODiOeUqOeUu+WDj+aSruW9seeUqFxuICAgICAgICAvLyBsZXQgb3JiaXRDb250cm9scyA9IG5ldyBPcmJpdENvbnRyb2xzKGNhbWVyYSwgcmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgICAgICAgdGhpcy5jcmVhdGVTY2VuZSgpO1xuICAgICAgICAvLyDmr47jg5Xjg6zjg7zjg6Djga51cGRhdGXjgpLlkbzjgpPjgafvvIxyZW5kZXJcbiAgICAgICAgLy8gcmVxZXN0QW5pbWF0aW9uRnJhbWUg44Gr44KI44KK5qyh44OV44Os44O844Og44KS5ZG844G2XG4gICAgICAgIGxldCByZW5kZXI6IEZyYW1lUmVxdWVzdENhbGxiYWNrID0gKHRpbWUpID0+IHtcbiAgICAgICAgICAgIHJlbmRlcmVyLnJlbmRlcih0aGlzLnNjZW5lLCBjYW1lcmEpO1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XG4gICAgICAgICAgICAvLyBvcmJpdENvbnRyb2xzLnVwZGF0ZSgpO1xuICAgICAgICB9O1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcblxuICAgICAgICByZW5kZXJlci5kb21FbGVtZW50LnN0eWxlLmNzc0Zsb2F0ID0gXCJsZWZ0XCI7XG4gICAgICAgIHJlbmRlcmVyLmRvbUVsZW1lbnQuc3R5bGUubWFyZ2luID0gXCIxMHB4XCI7XG4gICAgICAgIC8vIOODhuOCr+OCueODgeODo+OBruiJsuepuumWk+OBq+WQiOOCj+OBm+OBpuWHuuWKm+OCknNSR0LjgavlpInjgYjjgotcbiAgICAgICAgcmVuZGVyZXIub3V0cHV0RW5jb2RpbmcgPSBUSFJFRS5zUkdCRW5jb2Rpbmc7XG4gICAgICAgIHJldHVybiByZW5kZXJlci5kb21FbGVtZW50O1xuICAgIH07XG5cbiAgICAvLyDjgrfjg7zjg7Pjga7kvZzmiJAo5YWo5L2T44GnMeWbnilcbiAgICBwcml2YXRlIGNyZWF0ZVNjZW5lID0gKCkgPT4ge1xuICAgICAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG4gICAgICAgIHRoaXMud29ybGQgPSBuZXcgQ0FOTk9OLldvcmxkKHsgZ3Jhdml0eTogbmV3IENBTk5PTi5WZWMzKDAsIC05LjgyLCAwKSB9KTtcbiAgICAgICAgdGhpcy53b3JsZC5kZWZhdWx0Q29udGFjdE1hdGVyaWFsLmZyaWN0aW9uID0gMC4xO1xuICAgICAgICB0aGlzLndvcmxkLmRlZmF1bHRDb250YWN0TWF0ZXJpYWwucmVzdGl0dXRpb24gPSAwLjU7XG5cbiAgICAgICAgLy8g5YuV5L2c5qSc6Ki855So44OH44OQ44OD44Ks44O8XG4gICAgICAgIC8vIGNvbnN0IGNhbm5vbkRlYnVnZ2VyID0gQ2Fubm9uRGVidWdnZXIodGhpcy5zY2VuZSwgdGhpcy53b3JsZCwge2NvbG9yOiAweGZmMDAwMH0pO1xuXG4gICAgICAgIHRoaXMuc2V0dXBTY2VuZSgpO1xuXG4gICAgICAgIGNvbnN0IGNsb2NrID0gbmV3IFRIUkVFLkNsb2NrKCk7XG5cbiAgICAgICAgLy8g5pyA5Yid44Gg44GR6ZaL5aeLNeenkuOBp+OCouODvOODoOOBjOWLleOBj+OCiOOBhuOBq+ioreWumlxuICAgICAgICBsZXQgYXJtVGltZXIgPSAxMTtcbiAgICAgICAgbGV0IHNwYXduVGltZXIgPSAzO1xuXG4gICAgICAgIC8vIOavjuODleODrOODvOODoOOBrnVwZGF0ZeOCkuWRvOOCk+OBp++8jOabtOaWsFxuICAgICAgICAvLyByZXFlc3RBbmltYXRpb25GcmFtZSDjgavjgojjgormrKHjg5Xjg6zjg7zjg6DjgpLlkbzjgbZcbiAgICAgICAgbGV0IHVwZGF0ZTogRnJhbWVSZXF1ZXN0Q2FsbGJhY2sgPSAodGltZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy53b3JsZC5maXhlZFN0ZXAoKTtcblxuICAgICAgICAgICAgY29uc3QgZGVsdGEgPSBjbG9jay5nZXREZWx0YSgpO1xuICAgICAgICAgICAgc3Bhd25UaW1lciArPSBkZWx0YTtcbiAgICAgICAgICAgIGFybVRpbWVyICs9IGRlbHRhO1xuXG4gICAgICAgICAgICAvLyDjgqLjg7zjg6DjgpLli5XjgYvjgZlcbiAgICAgICAgICAgIGlmICh0aGlzLmFybSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFybVRpbWVyID4gMTYpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcm0ubW92ZSh0aGlzLm1vZGVscywgdGhpcy5nb2FsKTtcbiAgICAgICAgICAgICAgICAgICAgYXJtVGltZXIgPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g6JC95LiL44GX44Gf44Oi44OH44Or44KSMuenkuOBlOOBqOOBq+W+qea0u+OBleOBm+OCi1xuICAgICAgICAgICAgaWYgKHNwYXduVGltZXIgPiAyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3Bhd25RdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOODouODh+ODq+OBrumAn+W6puOBqOWbnui7ouOCkuODquOCu+ODg+ODiOOBmeOCi1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vZGVsc1t0aGlzLnNwYXduUXVldWVbMF1dLmdldEJvZHkoKS52ZWxvY2l0eSA9IG5ldyBDQU5OT04uVmVjMygwLCAwLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb2RlbHNbdGhpcy5zcGF3blF1ZXVlWzBdXS5nZXRCb2R5KCkuYW5ndWxhclZlbG9jaXR5ID0gbmV3IENBTk5PTi5WZWMzKDAsIDAsIDApO1xuICAgICAgICAgICAgICAgICAgICAvLyDjg6Ljg4fjg6vjga7liJ3mnJ/ljJZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb2RlbHNbdGhpcy5zcGF3blF1ZXVlWzBdXS5nZXRCb2R5KCkucG9zaXRpb24gPSBuZXcgQ0FOTk9OLlZlYzMoKE1hdGgucmFuZG9tKCkgKiAyIC0gMSkgKiA4LCAyMCwgKE1hdGgucmFuZG9tKCkgKiAyIC0gMSkgKiA4KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb2RlbHNbdGhpcy5zcGF3blF1ZXVlWzBdXS5nZXRCb2R5KCkucXVhdGVybmlvbiA9IG5ldyBDQU5OT04uUXVhdGVybmlvbigpLnNldEZyb21FdWxlcihNYXRoLnJhbmRvbSgpLCBNYXRoLnJhbmRvbSgpLCBNYXRoLnJhbmRvbSgpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcGF3blF1ZXVlLnNwbGljZSgwLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3Bhd25UaW1lciA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOWFqOOBpuOBruODouODh+ODq+OBq+WvvuOBl+OBpuabtOaWsOWHpueQhuOCkuihjOOBhlxuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5tb2RlbHMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtb2RlbCA9IHRoaXMubW9kZWxzW2tleV07XG4gICAgICAgICAgICAgICAgaWYgKG1vZGVsID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG1vZGVsLnVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgIC8vIOODouODh+ODq+OBjOiQveS4i+OBl+OBn+OCieW+qea0u+OCreODpeODvOOBq+OBhOOCjOOCi1xuICAgICAgICAgICAgICAgIGlmIChtb2RlbC5nZXRCb2R5KCkucG9zaXRpb24ueSA8IC0xNSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc3Bhd25RdWV1ZS5pbmNsdWRlcyhrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNwYXduUXVldWUucHVzaChrZXkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY2Fubm9uRGVidWdnZXIudXBkYXRlKCk7XG5cbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xuICAgICAgICAgICAgVFdFRU4udXBkYXRlKCk7IC8v6L+95Yqg5YiGXG4gICAgICAgIH07XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xuICAgIH07XG5cbiAgICAvLyDjgrfjg7zjg7Pjga7kvZzmiJAo5YWo5L2T44GnMeWbnilcbiAgICBwcml2YXRlIHNldHVwU2NlbmUgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8v44Op44Kk44OI44Gu6Kit5a6aXG4gICAgICAgIGNvbnN0IGxpZ2h0MSA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4YWFhYWFhKTtcbiAgICAgICAgbGV0IGx2ZWMgPSBuZXcgVEhSRUUuVmVjdG9yMygxLCAxLCAxKS5ub3JtYWxpemUoKTtcbiAgICAgICAgbGlnaHQxLnBvc2l0aW9uLnNldChsdmVjLngsIGx2ZWMueSwgbHZlYy56KTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQobGlnaHQxKTtcblxuICAgICAgICBjb25zdCBsaWdodDIgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCgweDUwNTA1MCk7XG4gICAgICAgIGxpZ2h0Mi5wb3NpdGlvbi5zZXQoMCwgMzAsIDApO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChsaWdodDIpO1xuXG4gICAgICAgIC8vIOiqreOBv+i+vOOBv+OBq+aZgumWk+OBjOOBi+OBi+OCi+OBn+OCgemdnuWQjOacn+OBp+WHpueQhuOBmeOCi1xuICAgICAgICBhd2FpdCBuZXcgR0xURkxvYWRlcigpLmxvYWQoXCJhcm0uZ2x0ZlwiLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbW9kZWwgPSBkYXRhLnNjZW5lO1xuICAgICAgICAgICAgbW9kZWwucG9zaXRpb24ueSA9IDI4O1xuICAgICAgICAgICAgdGhpcy5hcm0gPSBuZXcgQXJtKG1vZGVsKTtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMuYXJtLmdldE9iamVjdCgpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXdhaXQgbmV3IEdMVEZMb2FkZXIoKS5sb2FkKFwiZnJhbWUuZ2x0ZlwiLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbW9kZWwgPSBkYXRhLnNjZW5lO1xuICAgICAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBtb2RlbC5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgIC8vIOWQjeWJjeOBjGNvbOOBi+OCieWni+OBvuOCi+ODoeODg+OCt+ODpeOBq+WvvuOBl+OBpuW9k+OBn+OCiuWIpOWumuOCkuOBpOOBkeOCi1xuICAgICAgICAgICAgICAgIGlmIChjaGlsZC5uYW1lLnNlYXJjaCgvY29sXy4rLykgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBib2R5ID0gZ2V0Qm94Qm9keUZyb21HZW9tZXRyeSgoY2hpbGQgYXMgVEhSRUUuTWVzaCkuZ2VvbWV0cnksIDApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLndvcmxkLmFkZEJvZHkoYm9keSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjaGlsZC5uYW1lLnNlYXJjaCgvZ29hbC8pID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g6JC95LiL5Zyw54K544KS6Kit5a6a44GZ44KL55So44Gu44Kq44OW44K444Kn44Kv44OI44GL44KJ5bqn5qiZ44KS5Y+W5b6X44GZ44KLXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ29hbCA9IGNoaWxkLnBvc2l0aW9uO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2NlbmUuYWRkKG1vZGVsKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8g5q2j6Z2i44Gu6YCP5piO44Gq44OR44ON44OrXG4gICAgICAgIGNvbnN0IHBsYW5lU2hhcGUgPSBuZXcgQ0FOTk9OLlBsYW5lKCk7XG4gICAgICAgIGNvbnN0IHBsYW5lQm9keSA9IG5ldyBDQU5OT04uQm9keSh7IG1hc3M6IDAgfSk7XG4gICAgICAgIHBsYW5lQm9keS5hZGRTaGFwZShwbGFuZVNoYXBlKTtcbiAgICAgICAgcGxhbmVCb2R5LnBvc2l0aW9uLnNldCgwLCAxMCwgMTApO1xuICAgICAgICBwbGFuZUJvZHkucXVhdGVybmlvbiA9IG5ldyBDQU5OT04uUXVhdGVybmlvbigpLnNldEZyb21FdWxlcigwLCBNYXRoLlBJLCAwKTtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRCb2R5KHBsYW5lQm9keSk7XG5cbiAgICAgICAgdGhpcy5tb2RlbHMgPSBbXTtcbiAgICAgICAgdGhpcy5zcGF3blF1ZXVlID0gW107XG5cbiAgICAgICAgLy8g44Oi44OH44Or44KS55Sf5oiQ44GZ44KL44CCXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCAzMDsgaW5kZXgrKykge1xuICAgICAgICAgICAgY29uc3QgZGVmYXVsdFBvc2l0aW9uID0gbmV3IENBTk5PTi5WZWMzKChNYXRoLnJhbmRvbSgpICogMiAtIDEpICogMTAsIDIwLCAoTWF0aC5yYW5kb20oKSAqIDIgLSAxKSAqIDEwKTtcbiAgICAgICAgICAgIC8vIDEvMuOBrueiuueOh+OBp+ODouODh+ODq+OBjOWIh+OCiuabv+OCj+OCi1xuICAgICAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPiAwLjUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzaGFwZSA9IG5ldyBDQU5OT04uQm94KG5ldyBDQU5OT04uVmVjMygxLCAyLjcsIDEpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQmFuZGxlT2JqZWN0KFxuICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICBuZXcgQ0FOTk9OLkJvZHkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFzczogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYXBlOiBzaGFwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBkZWZhdWx0UG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBxdWF0ZXJuaW9uOiBuZXcgQ0FOTk9OLlF1YXRlcm5pb24oKS5zZXRGcm9tRXVsZXIoTWF0aC5yYW5kb20oKSwgTWF0aC5yYW5kb20oKSwgTWF0aC5yYW5kb20oKSksXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBvYmoub2Zmc2V0LnkgPSAyLjc7XG4gICAgICAgICAgICAgICAgbmV3IEdMVEZMb2FkZXIoKS5sb2FkKFwiY2hhcmFjdGVyX21vZGVsLmdsdGZcIiwgKGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbW9kZWwgPSBkYXRhLnNjZW5lO1xuICAgICAgICAgICAgICAgICAgICBtb2RlbC5zY2FsZS54ID0gMC4yNTtcbiAgICAgICAgICAgICAgICAgICAgbW9kZWwuc2NhbGUueSA9IDAuMjU7XG4gICAgICAgICAgICAgICAgICAgIG1vZGVsLnNjYWxlLnogPSAwLjI1O1xuICAgICAgICAgICAgICAgICAgICBvYmouc2V0T2JqZWN0KG1vZGVsKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5hZGQobW9kZWwpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMubW9kZWxzLnB1c2gob2JqKTtcbiAgICAgICAgICAgICAgICB0aGlzLndvcmxkLmFkZEJvZHkob2JqLmdldEJvZHkoKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNoYXBlID0gbmV3IENBTk5PTi5Cb3gobmV3IENBTk5PTi5WZWMzKDEsIDEsIDEpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBvYmogPSBuZXcgQmFuZGxlT2JqZWN0KFxuICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICBuZXcgQ0FOTk9OLkJvZHkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFzczogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYXBlOiBzaGFwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBkZWZhdWx0UG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBxdWF0ZXJuaW9uOiBuZXcgQ0FOTk9OLlF1YXRlcm5pb24oKS5zZXRGcm9tRXVsZXIoTWF0aC5yYW5kb20oKSwgTWF0aC5yYW5kb20oKSwgTWF0aC5yYW5kb20oKSksXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBuZXcgR0xURkxvYWRlcigpLmxvYWQoXCJzb2ZrZW4uZ2x0ZlwiLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtb2RlbCA9IGRhdGEuc2NlbmU7XG4gICAgICAgICAgICAgICAgICAgIG1vZGVsLnNjYWxlLnggPSAwLjU7XG4gICAgICAgICAgICAgICAgICAgIG1vZGVsLnNjYWxlLnkgPSAwLjU7XG4gICAgICAgICAgICAgICAgICAgIG1vZGVsLnNjYWxlLnogPSAwLjU7XG4gICAgICAgICAgICAgICAgICAgIG9iai5zZXRPYmplY3QobW9kZWwpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLmFkZChtb2RlbCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5tb2RlbHMucHVzaChvYmopO1xuICAgICAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQm9keShvYmouZ2V0Qm9keSgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBpbml0KTtcblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBsZXQgY29udGFpbmVyID0gbmV3IFRocmVlSlNDb250YWluZXIoKTtcblxuICAgIGxldCB2aWV3cG9ydCA9IGNvbnRhaW5lci5jcmVhdGVSZW5kZXJlckRPTSg2NDAsIDQ4MCwgbmV3IFRIUkVFLlZlY3RvcjMoMCwgMTYsIDE2KSk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh2aWV3cG9ydCk7XG59XG5cbi8vIFRKU+OBruOCquODluOCuOOCp+OCr+ODiOOBqGNhbm5vbi1lc+OBrmJvZHnjgpLlkIzmmYLjgavmk43kvZzjgZnjgovjgZ/jgoHjga7jgq/jg6njgrlcbmNsYXNzIEJhbmRsZU9iamVjdCB7XG4gICAgcHJpdmF0ZSBvYmplY3Q6IFRIUkVFLk9iamVjdDNEO1xuICAgIHByaXZhdGUgYm9keTogQ0FOTk9OLkJvZHk7XG5cbiAgICBwdWJsaWMgb2Zmc2V0OiBUSFJFRS5WZWN0b3IzO1xuICAgIHByaXZhdGUgaXNMaW5rZWQ6IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcihvYmplY3Q6IFRIUkVFLk9iamVjdDNELCBib2R5OiBDQU5OT04uQm9keSkge1xuICAgICAgICB0aGlzLm9iamVjdCA9IG9iamVjdDtcbiAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcbiAgICAgICAgdGhpcy5vZmZzZXQgPSBuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAwKTtcbiAgICB9XG5cbiAgICAvLyDmm7TmlrDlh6bnkIZcbiAgICBwdWJsaWMgdXBkYXRlKCkge1xuICAgICAgICBpZiAodGhpcy5vYmplY3QgPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g44Ki44O844Og44Gr5o6044G+44KM44Gm44GE44KL44Go44GN44Gv5YuV44GL44Gq44GE44KI44GG44Gr44GZ44KLXG4gICAgICAgIGlmICh0aGlzLmlzTGlua2VkKSB7XG4gICAgICAgICAgICB0aGlzLmJvZHkubWFzcyA9IDA7XG4gICAgICAgICAgICB0aGlzLmJvZHkudmVsb2NpdHkgPSBuZXcgQ0FOTk9OLlZlYzMoMCwgMCwgMCk7XG4gICAgICAgICAgICB0aGlzLmJvZHkuYW5ndWxhclZlbG9jaXR5ID0gbmV3IENBTk5PTi5WZWMzKDAsIDAsIDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5ib2R5Lm1hc3MgPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVEpT44Gu44Kq44OW44K444Kn44Kv44OI44GoY2Fubm9uLWVz44GuQm9keeOBruOBmuOCjOOCkuijnOato+OBl+OBn+W6p+aomVxuICAgICAgICBjb25zdCBwb3MgPSB0aGlzLmdldFJvdGF0ZWRQb3NpdGlvbigpO1xuICAgICAgICB0aGlzLm9iamVjdC5wb3NpdGlvbi5zZXQocG9zLngsIHBvcy55LCBwb3Mueik7XG4gICAgICAgIHRoaXMub2JqZWN0LnF1YXRlcm5pb24uc2V0KHRoaXMuYm9keS5xdWF0ZXJuaW9uLngsIHRoaXMuYm9keS5xdWF0ZXJuaW9uLnksIHRoaXMuYm9keS5xdWF0ZXJuaW9uLnosIHRoaXMuYm9keS5xdWF0ZXJuaW9uLncpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRPYmplY3Qob2JqZWN0KSB7XG4gICAgICAgIHRoaXMub2JqZWN0ID0gb2JqZWN0O1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRCb2R5KGJvZHkpIHtcbiAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0T2JqZWN0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vYmplY3Q7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEJvZHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJvZHk7XG4gICAgfVxuXG4gICAgcHVibGljIHNldElzTGlua2VkKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuaXNMaW5rZWQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Um90YXRlZFBvc2l0aW9uKCkge1xuICAgICAgICBjb25zdCBxdWF0ZXJuaW9uID0gbmV3IFRIUkVFLlF1YXRlcm5pb24odGhpcy5ib2R5LnF1YXRlcm5pb24ueCwgdGhpcy5ib2R5LnF1YXRlcm5pb24ueSwgdGhpcy5ib2R5LnF1YXRlcm5pb24ueiwgdGhpcy5ib2R5LnF1YXRlcm5pb24udyk7XG4gICAgICAgIGNvbnN0IG9mZnNldFJvdGF0ZWQgPSB0aGlzLm9mZnNldC5jbG9uZSgpLmFwcGx5UXVhdGVybmlvbihxdWF0ZXJuaW9uKTtcbiAgICAgICAgcmV0dXJuIG5ldyBUSFJFRS5WZWN0b3IzKHRoaXMuYm9keS5wb3NpdGlvbi54IC0gb2Zmc2V0Um90YXRlZC54LCB0aGlzLmJvZHkucG9zaXRpb24ueSAtIG9mZnNldFJvdGF0ZWQueSwgdGhpcy5ib2R5LnBvc2l0aW9uLnogLSBvZmZzZXRSb3RhdGVkLnopO1xuICAgIH1cbn1cblxuLy8g44Ki44O844Og44Gu44Kv44Op44K5XG5jbGFzcyBBcm0ge1xuICAgIHByaXZhdGUgb2JqZWN0OiBUSFJFRS5Hcm91cDtcbiAgICBwcml2YXRlIHJpZ2h0QXJtO1xuICAgIHByaXZhdGUgbGVmdEFybTtcbiAgICBwcml2YXRlIG9wZW5Ud2VlbjtcbiAgICBwcml2YXRlIGNsb3NlVHdlZW47XG4gICAgcHJpdmF0ZSBjdXJyZW50VGFyZ2V0ID0gMDtcbiAgICBwcml2YXRlIGlzTGlua2VkID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3RvcihvYmplY3QpIHtcbiAgICAgICAgdGhpcy5vYmplY3QgPSBvYmplY3Q7XG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2Ygb2JqZWN0LmNoaWxkcmVuKSB7XG4gICAgICAgICAgICBpZiAoY2hpbGQubmFtZSA9PT0gXCJyaWdodF9hcm1cIikge1xuICAgICAgICAgICAgICAgIHRoaXMucmlnaHRBcm0gPSBjaGlsZDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2hpbGQubmFtZSA9PT0gXCJsZWZ0X2FybVwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sZWZ0QXJtID0gY2hpbGQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgbW92ZShtb2RlbHMsIGdvYWwpIHtcbiAgICAgICAgbGV0IHRhcmdldCA9IG1vZGVsc1t0aGlzLmN1cnJlbnRUYXJnZXRdO1xuICAgICAgICBsZXQgdHdlZW5pbmZvID0geyB4OiB0aGlzLm9iamVjdC5wb3NpdGlvbi54LCB5OiB0aGlzLm9iamVjdC5wb3NpdGlvbi55LCB6OiB0aGlzLm9iamVjdC5wb3NpdGlvbi56LCByb3RhdGlvbjogMCB9O1xuICAgICAgICBjb25zdCB1cGRhdGUgPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9iamVjdC5wb3NpdGlvbi54ID0gdHdlZW5pbmZvLng7XG4gICAgICAgICAgICB0aGlzLm9iamVjdC5wb3NpdGlvbi55ID0gdHdlZW5pbmZvLnk7XG4gICAgICAgICAgICB0aGlzLm9iamVjdC5wb3NpdGlvbi56ID0gdHdlZW5pbmZvLno7XG4gICAgICAgICAgICB0aGlzLnJpZ2h0QXJtLnJvdGF0aW9uLnogPSAtdHdlZW5pbmZvLnJvdGF0aW9uO1xuICAgICAgICAgICAgdGhpcy5sZWZ0QXJtLnJvdGF0aW9uLnogPSB0d2VlbmluZm8ucm90YXRpb247XG4gICAgICAgICAgICAvLyDmjrTjgpPjgafjgYTjgovplpPjga/jg6Ljg4fjg6vjgajluqfmqJnjgpLlkIzmnJ/jgZnjgotcbiAgICAgICAgICAgIGlmICh0aGlzLmlzTGlua2VkKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmdldEJvZHkoKS5wb3NpdGlvbi5zZXQodHdlZW5pbmZvLngsIHR3ZWVuaW5mby55IC0gMywgdHdlZW5pbmZvLnopO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFR3ZWVu44Gu6Kit5a6aXG4gICAgICAgIGNvbnN0IHN0YXJ0RGlzdGFuY2UgPSBnZXREaXN0YW5jZUFycmF5KHRoaXMub2JqZWN0LnBvc2l0aW9uLCB0YXJnZXQuZ2V0Qm9keSgpLnBvc2l0aW9uKTtcbiAgICAgICAgY29uc3QgeFN0YXJ0VHdlZW4gPSBuZXcgVFdFRU4uVHdlZW4odHdlZW5pbmZvKS50byh7IHg6IHRhcmdldC5nZXRCb2R5KCkucG9zaXRpb24ueCB9LCBzdGFydERpc3RhbmNlWzBdIC8gMC4wMSkub25VcGRhdGUodXBkYXRlKTtcbiAgICAgICAgY29uc3QgelN0YXJ0VHdlZW4gPSBuZXcgVFdFRU4uVHdlZW4odHdlZW5pbmZvKS50byh7IHo6IHRhcmdldC5nZXRCb2R5KCkucG9zaXRpb24ueiB9LCBzdGFydERpc3RhbmNlWzJdIC8gMC4wMSkub25VcGRhdGUodXBkYXRlKTtcbiAgICAgICAgY29uc3QgeVN0YXJ0VHdlZW4gPSBuZXcgVFdFRU4uVHdlZW4odHdlZW5pbmZvKS50byh7IHk6IHRhcmdldC5nZXRCb2R5KCkucG9zaXRpb24ueSArIDMgfSwgc3RhcnREaXN0YW5jZVsxXSAvIDAuMDEpLm9uVXBkYXRlKHVwZGF0ZSk7XG5cbiAgICAgICAgY29uc3QgZ29hbERpc3RhbmNlID0gZ2V0RGlzdGFuY2VBcnJheSh0YXJnZXQuZ2V0Qm9keSgpLnBvc2l0aW9uLCBnb2FsLmNsb25lKCkuc2V0WSgyMCkpO1xuICAgICAgICBjb25zdCB4R29hbFR3ZWVuID0gbmV3IFRXRUVOLlR3ZWVuKHR3ZWVuaW5mbykudG8oeyB4OiBnb2FsLnggfSwgZ29hbERpc3RhbmNlWzBdIC8gMC4wMSkub25VcGRhdGUodXBkYXRlKTtcbiAgICAgICAgY29uc3QgekdvYWxUd2VlbiA9IG5ldyBUV0VFTi5Ud2Vlbih0d2VlbmluZm8pLnRvKHsgejogZ29hbC56IH0sIGdvYWxEaXN0YW5jZVsyXSAvIDAuMDEpLm9uVXBkYXRlKHVwZGF0ZSk7XG4gICAgICAgIGNvbnN0IHlHb2FsVHdlZW4gPSBuZXcgVFdFRU4uVHdlZW4odHdlZW5pbmZvKS50byh7IHk6IDIwIH0sIGdvYWxEaXN0YW5jZVsxXSAvIDAuMDEpLm9uVXBkYXRlKHVwZGF0ZSk7XG5cbiAgICAgICAgY29uc3QgY2xvc2VUd2VlbiA9IG5ldyBUV0VFTi5Ud2Vlbih0d2VlbmluZm8pXG4gICAgICAgICAgICAudG8oeyByb3RhdGlvbjogTWF0aC5QSSAvIDQgfSwgNTAwKVxuICAgICAgICAgICAgLm9uVXBkYXRlKHVwZGF0ZSlcbiAgICAgICAgICAgIC5vbkNvbXBsZXRlKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmlzTGlua2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0YXJnZXQuc2V0SXNMaW5rZWQodHJ1ZSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBvcGVuVHdlZW4gPSBuZXcgVFdFRU4uVHdlZW4odHdlZW5pbmZvKVxuICAgICAgICAgICAgLnRvKHsgcm90YXRpb246IDAgfSwgNTAwKVxuICAgICAgICAgICAgLm9uVXBkYXRlKHVwZGF0ZSlcbiAgICAgICAgICAgIC5lYXNpbmcoVFdFRU4uRWFzaW5nLkVsYXN0aWMuT3V0KSAvLyDli6LjgYToia/jgY/pm6LjgZfjgabjgYTjgovmhJ/jgpLlh7rjgZnjgZ/jgoHjgavjgZPjgZPjgaDjgZHjgqTjg7zjgrjjg7PjgrBcbiAgICAgICAgICAgIC5vbkNvbXBsZXRlKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmlzTGlua2VkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LnNldElzTGlua2VkKGZhbHNlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSAodGhpcy5jdXJyZW50VGFyZ2V0ICsgMSkgJSBtb2RlbHMubGVuZ3RoO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgeFN0YXJ0VHdlZW4uY2hhaW4oelN0YXJ0VHdlZW4uZGVsYXkoMTAwMCkpO1xuICAgICAgICB6U3RhcnRUd2Vlbi5jaGFpbih5U3RhcnRUd2Vlbi5kZWxheSgxMDAwKSk7XG4gICAgICAgIHlTdGFydFR3ZWVuLmNoYWluKGNsb3NlVHdlZW4uZGVsYXkoNTAwKSk7XG4gICAgICAgIGNsb3NlVHdlZW4uY2hhaW4oeUdvYWxUd2Vlbi5kZWxheSgxMDAwKSk7XG4gICAgICAgIHlHb2FsVHdlZW4uY2hhaW4oekdvYWxUd2Vlbi5kZWxheSgxMDAwKSk7XG4gICAgICAgIHpHb2FsVHdlZW4uY2hhaW4oeEdvYWxUd2Vlbi5kZWxheSgxMDAwKSk7XG4gICAgICAgIHhHb2FsVHdlZW4uY2hhaW4ob3BlblR3ZWVuLmRlbGF5KDUwMCkpO1xuXG4gICAgICAgIC8vIOiQveOBqOOBl+OBn+W+jOacgOWIneOBrumrmOOBleOBq+aIu+OCi1xuICAgICAgICBvcGVuVHdlZW4uY2hhaW4obmV3IFRXRUVOLlR3ZWVuKHR3ZWVuaW5mbykudG8oeyB5OiAyOCB9LCAyMDApLm9uVXBkYXRlKHVwZGF0ZSkuZGVsYXkoNDAwKSk7XG5cbiAgICAgICAgeFN0YXJ0VHdlZW4uc3RhcnQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0T2JqZWN0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vYmplY3Q7XG4gICAgfVxufVxuXG4vLyDpoILngrnjgYvjgolCb2R544KS55Sf5oiQ44GZ44KLXG5mdW5jdGlvbiBnZXRCb3hCb2R5RnJvbUdlb21ldHJ5KGdlb21ldHJ5LCBtYXNzKSB7XG4gICAgbGV0IG1pbiA9IFtJbmZpbml0eSwgSW5maW5pdHksIEluZmluaXR5XTtcbiAgICBsZXQgbWF4ID0gWy1JbmZpbml0eSwgLUluZmluaXR5LCAtSW5maW5pdHldO1xuXG4gICAgLy8g6ZqF44Gu6aCC54K544KS5b6X44KLXG4gICAgY29uc3QgdmVydGljZXMgPSBnZW9tZXRyeS5hdHRyaWJ1dGVzLnBvc2l0aW9uLmFycmF5O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmVydGljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHZlcnRpY2VzW2ldIDwgbWluW2kgJSAzXSkgbWluW2kgJSAzXSA9IHZlcnRpY2VzW2ldO1xuICAgICAgICBpZiAodmVydGljZXNbaV0gPiBtYXhbaSAlIDNdKSBtYXhbaSAlIDNdID0gdmVydGljZXNbaV07XG4gICAgfVxuXG4gICAgLy8gc2hhcGXjga7kvZzmiJBcbiAgICBjb25zdCBzaXplID0gWyhtYXhbMF0gLSBtaW5bMF0pIC8gMiwgKG1heFsxXSAtIG1pblsxXSkgLyAyLCAobWF4WzJdIC0gbWluWzJdKSAvIDJdO1xuICAgIGNvbnN0IGJveFNoYXBlID0gbmV3IENBTk5PTi5Cb3gobmV3IENBTk5PTi5WZWMzKHNpemVbMF0sIHNpemVbMV0sIHNpemVbMl0pKTtcblxuICAgIC8vIGJvZHnjga7kvZzmiJBcbiAgICBjb25zdCBjZW50ZXIgPSBbKG1heFswXSArIG1pblswXSkgLyAyLCAobWF4WzFdICsgbWluWzFdKSAvIDIsIChtYXhbMl0gKyBtaW5bMl0pIC8gMl07XG4gICAgY29uc3QgYm9keSA9IG5ldyBDQU5OT04uQm9keSh7XG4gICAgICAgIG1hc3M6IG1hc3MsXG4gICAgICAgIHNoYXBlOiBib3hTaGFwZSxcbiAgICAgICAgcG9zaXRpb246IG5ldyBDQU5OT04uVmVjMyhjZW50ZXJbMF0sIGNlbnRlclsxXSwgY2VudGVyWzJdKSxcbiAgICB9KTtcblxuICAgIHJldHVybiBib2R5O1xufVxuXG4vLyDjg5njgq/jg4jjg6vjga7ou7jjgZTjgajjga7ot53pm6LjgpLov5TjgZlcbmZ1bmN0aW9uIGdldERpc3RhbmNlQXJyYXkob3JpZ2luOiBUSFJFRS5WZWN0b3IzLCB0YXJnZXQ6IFRIUkVFLlZlY3RvcjMpIHtcbiAgICByZXR1cm4gW01hdGguYWJzKG9yaWdpbi54IC0gdGFyZ2V0LngpLCBNYXRoLmFicyhvcmlnaW4ueSAtIHRhcmdldC55KSwgTWF0aC5hYnMob3JpZ2luLnogLSB0YXJnZXQueildO1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCJ2YXIgZGVmZXJyZWQgPSBbXTtcbl9fd2VicGFja19yZXF1aXJlX18uTyA9IChyZXN1bHQsIGNodW5rSWRzLCBmbiwgcHJpb3JpdHkpID0+IHtcblx0aWYoY2h1bmtJZHMpIHtcblx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0Zm9yKHZhciBpID0gZGVmZXJyZWQubGVuZ3RoOyBpID4gMCAmJiBkZWZlcnJlZFtpIC0gMV1bMl0gPiBwcmlvcml0eTsgaS0tKSBkZWZlcnJlZFtpXSA9IGRlZmVycmVkW2kgLSAxXTtcblx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRlZmVycmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIFtjaHVua0lkcywgZm4sIHByaW9yaXR5XSA9IGRlZmVycmVkW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2h1bmtJZHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdGlmICgocHJpb3JpdHkgJiAxID09PSAwIHx8IG5vdEZ1bGZpbGxlZCA+PSBwcmlvcml0eSkgJiYgT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5PKS5ldmVyeSgoa2V5KSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXy5PW2tleV0oY2h1bmtJZHNbal0pKSkpIHtcblx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihmdWxmaWxsZWQpIHtcblx0XHRcdGRlZmVycmVkLnNwbGljZShpLS0sIDEpXG5cdFx0XHR2YXIgciA9IGZuKCk7XG5cdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwibWFpblwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRpZihjaHVua0lkcy5zb21lKChpZCkgPT4gKGluc3RhbGxlZENodW5rc1tpZF0gIT09IDApKSkge1xuXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdH1cblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtjZ3ByZW5kZXJpbmdcIl0gPSBzZWxmW1wid2VicGFja0NodW5rY2dwcmVuZGVyaW5nXCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJ2ZW5kb3JzLW5vZGVfbW9kdWxlc190d2VlbmpzX3R3ZWVuX2pzX2Rpc3RfdHdlZW5fZXNtX2pzLW5vZGVfbW9kdWxlc19jYW5ub24tZXNfZGlzdF9jYW5ub24tZXMtODMxNjE1XCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2FwcC50c1wiKSkpXG5fX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKF9fd2VicGFja19leHBvcnRzX18pO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9