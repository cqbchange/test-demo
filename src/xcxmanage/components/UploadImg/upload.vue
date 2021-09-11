<template>
    <el-dialog :close-on-click-modal="false" title="生成任务图" :before-close="off" :visible.sync="value"
        custom-class="my-dialog vue-image-upload" width="700px" :append-to-body="true" style="margin-left: 210px;"
        :close-on-press-escape="false">
        <el-form size="medium">
            <el-form-item label="上传原图:" label-width="100px">
                <div class="vicp-crop-btn" @dragleave="preventDefault" @dragover="preventDefault"
                    @dragenter="preventDefault" @click="handleClick" @drop="handleChange">
                    <el-button icon="el-icon-upload" circle v-show="loading !== 1"></el-button>
                    <input type="file" accept="image/*" v-show="false" @change="handleChange" ref="fileinput">
                </div>
            </el-form-item>
            <el-form-item label="上传原图:" label-width="100px" v-show="sourceImgUrl!=''">
                <div class="vicp-crop-img">
                    <el-row :gutter="20">
                        <el-col :span="13">
                            <div class="vicp-img-container" @wheel.prevent="handleMouseWheel">
                                <img :src="sourceImgUrl" :style="sourceImgStyle" class="vicp-img" draggable="false"
                                    @drag="preventDefault" @dragstart="preventDefault" @dragend="preventDefault"
                                    @dragleave="preventDefault" @dragover="preventDefault" @dragenter="preventDefault"
                                    @drop="preventDefault" @touchstart="imgStartMove" @touchmove="imgMove"
                                    @touchend="createImg" @touchcancel="createImg" @mousedown="imgStartMove"
                                    @mousemove="imgMove" @mouseup="createImg" @mouseout="createImg" ref="img">

                                <div class="vicp-img-shade vicp-img-shade-1" :style="sourceImgShadeStyle"></div>
                                <div class="vicp-img-shade vicp-img-shade-2" :style="sourceImgShadeStyle"></div>
                            </div>
                        </el-col>
                        <el-col :span="10">
                            <div class="vicp-range">
                                <input type="range" :value="scale.range" step="1" min="0" max="100"
                                    @mousemove="zoomChange">
                                <i @mousedown="startZoomSub" @mouseout="endZoomSub" @mouseup="endZoomSub"
                                    class="vicp-icon5"></i>
                                <i @mousedown="startZoomAdd" @mouseout="endZoomAdd" @mouseup="endZoomAdd"
                                    class="vicp-icon6"></i>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-form-item>
            <el-form-item label="选择背景:" label-width="100px" v-show="sourceImgUrl!=''">
                <img src="@img/task/bg/1.png" alt="1.png" class="vicp-bg-img" @click="setBgimg($event,taskStyle.img1)">
                <img src="@img/task/bg/2.png" alt="2.png" class="vicp-bg-img" @click="setBgimg($event,taskStyle.img2)">
                <img src="@img/task/bg/3.png" alt="3.png" class="vicp-bg-img" @click="setBgimg($event,taskStyle.img3)">
                <img src="@img/task/bg/4.png" alt="4.png" class="vicp-bg-img" @click="setBgimg($event,taskStyle.img4)">
                <img src="@img/task/bg/5.png" alt="5.png" class="vicp-bg-img" @click="setBgimg($event,taskStyle.img5)">
                <img src="@img/task/bg/6.png" alt="6.png" class="vicp-bg-img" @click="setBgimg($event,taskStyle.img6)">
            </el-form-item>

            <el-form-item label="气泡文字:" label-width="100px" v-show="sourceImgUrl!=''">
                <el-input size="medium" autocomplete="off" v-model="lang.btnTxt" clearable></el-input>
            </el-form-item>
            <el-row :gutter="20" v-show="sourceImgUrl!=''">
                <el-col :span="12">
                    <el-form-item label="任务图:" label-width="100px">
                        <div class="task-img-box" ref="taskimg">
                            <div class="border-box" :style="thisTaskStyle.borderColor">
                                <img :src="createImgUrl" class="img-source">
                            </div>
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="气泡图:" label-width="100px">
                        <div class="qp-img-box" ref="qpimg">
                            <div class="img-money">{{rewardType==1?'+25金币':'+1集分宝'}}</div>
                            <img :src="bgImg" class="img-bg">
                            <img :src="createImgUrl" class="img-source">
                            <div class="img-btn" :style="thisTaskStyle.background">{{lang.btnTxt}}</div>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <canvas v-show="false" :width="width" :height="height" ref="canvas"></canvas>
        <span slot="footer" class="dialog-footer">
            <el-button @click="off">取 消</el-button>
            <el-button type="primary" @click="prepareUpload">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import html2canvas from "html2canvas"
    import data2blob from './utils/data2blob.js';
    let mimes = {
        'jpg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'svg': 'image/svg+xml',
        'psd': 'image/photoshop'
    }
    export default {
        props: {
            // 域，上传文件name，触发事件会带上（如果一个页面多个图片上传控件，可以做区分
            field: {
                type: String,
                'default': 'avatar'
            },
            // 原名key，类似于id，触发事件会带上（如果一个页面多个图片上传控件，可以做区分
            ki: {
                type: String,
                'default': '0'
            },
            // 显示该控件与否
            value: {
                'default': true
            },
            // 上传地址
            url: {
                type: String,
                'default': ''
            },
            rewardType: {
                type: Number,
                default: 1
            },
            // 剪裁图片的宽
            width: {
                type: Number,
                default: 200
            },
            // 剪裁图片的高
            height: {
                type: Number,
                default: 200
            },
            // 单文件大小限制
            maxSize: {
                type: Number,
                'default': 10240
            },
            // 图片上传格式
            imgFormat: {
                type: String,
                'default': 'png'
            },
            // 图片背景 jpg情况下生效
            imgBgc: {
                type: String,
                'default': '#fff'
            },
            // 是否支持跨域
            withCredentials: {
                type: Boolean,
                'default': false
            },
            method: {
                type: String,
                'default': 'POST'
            },
            initialImgUrl: {
                type: String,
                'default': ''
            }
        },
        data() {
            let that = this,
                {
                    imgFormat,
                    width,
                    height
                } = that,
                isSupported = true,
                allowImgFormat = [
                    'jpg',
                    'png'
                ],
                tempImgFormat = allowImgFormat.indexOf(imgFormat) === -1 ? 'jpg' : imgFormat,
                lang = {
                    btnTxt: '关注直播间',
                    success: '上传成功',
                    fail: '图片上传失败',
                    error: {
                        onlyImg: '仅限图片格式',
                        outOfSize: '单文件大小不能超过 ',
                        lowestPx: '图片最低像素为（宽*高）：'
                    }
                },
                taskDataUrl,
                qpDataUrl,
                bgImg,
                taskStyle = {
                    img1: {
                        background: {
                            background: 'linear-gradient(180deg, #79E2FF, #29DEFF)'
                        },
                        borderColor: {
                            borderColor: '#29DEFF'
                        }
                    },
                    img2: {
                        background: {
                            background: 'linear-gradient(180deg, #6FB2FF, #3F98FF)'
                        },
                        borderColor: {
                            borderColor: '#3F98FF'
                        }
                    },
                    img3: {
                        background: {
                            background: 'linear-gradient(180deg, #F4AF4C, #F0930F)'
                        },
                        borderColor: {
                            borderColor: '#F0930F'
                        }
                    },
                    img4: {
                        background: {
                            background: 'linear-gradient(180deg, #FF6880, #F80E34)'
                        },
                        borderColor: {
                            borderColor: '#F80E34'
                        }
                    },
                    img5: {
                        background: {
                            background: 'linear-gradient(180deg, #F966FF, #DA1FE9)'
                        },
                        borderColor: {
                            borderColor: '#DA1FE9'
                        }
                    },
                    img6: {
                        background: {
                            background: 'linear-gradient(180deg, #C96AFF, #8E00F1)'
                        },
                        borderColor: {
                            borderColor: '#8E00F1'
                        }
                    }
                },
                thisTaskStyle = {
                    background: '',
                    borderColor: ''
                },
                mime = mimes[tempImgFormat];
            // 规范图片格式
            that.imgFormat = tempImgFormat;

            if (typeof FormData != 'function') {
                isSupported = false;
            }
            return {
                // 图片的mime
                mime,

                // 语言包
                lang,
                // 处理后图片
                taskDataUrl,
                qpDataUrl,
                // 背景图片
                bgImg,
                // 图片Style
                taskStyle,
                // 当前图片Style
                thisTaskStyle,

                // 浏览器是否支持该控件
                isSupported,
                // 浏览器是否支持触屏事件
                isSupportTouch: document.hasOwnProperty("ontouchstart"),

                // 上传状态及进度
                loading: 0, //0未开始 1正在 2成功 3错误
                progress: 0,

                // 需求图宽高比
                ratio: width / height,

                // 原图地址、生成图片地址
                sourceImg: null,
                sourceImgUrl: this.initialImgUrl,
                createImgUrl: this.initialImgUrl,

                // 原图片拖动事件初始值
                sourceImgMouseDown: {
                    on: false,
                    mX: 0, //鼠标按下的坐标
                    mY: 0,
                    x: 0, //scale原图坐标
                    y: 0
                },

                // 生成图片预览的容器大小
                previewContainer: {
                    width: 100,
                    height: 100
                },

                // 原图容器宽高
                sourceImgContainer: { // sic
                    width: 220,
                    height: 200 // 如果生成图比例与此一致会出现bug，先改成特殊的格式吧，哈哈哈
                },

                // 原图展示属性
                scale: {
                    zoomAddOn: false, //按钮缩放事件开启
                    zoomSubOn: false, //按钮缩放事件开启
                    range: 1, //最大100

                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0,
                    maxWidth: 0,
                    maxHeight: 0,
                    minWidth: 0, //最宽
                    minHeight: 0,
                    naturalWidth: 0, //原宽
                    naturalHeight: 0
                }
            }
        },
        computed: {
            // 进度条样式
            progressStyle() {
                let {
                    progress
                } = this;
                return {
                    width: progress + '%'
                }
            },
            // 原图样式
            sourceImgStyle() {
                let {
                    scale,
                    sourceImgMasking
                } = this,
                top = scale.y + sourceImgMasking.y + 'px',
                    left = scale.x + sourceImgMasking.x + 'px';
                return {
                    top,
                    left,
                    width: scale.width + 'px',
                    height: scale.height + 'px', // 兼容 Opera
                }
            },
            // 原图蒙版属性
            sourceImgMasking() {
                let {
                    width,
                    height,
                    ratio,
                    sourceImgContainer
                } = this,
                sic = sourceImgContainer,
                    sicRatio = sic.width / sic.height, // 原图容器宽高比
                    x = 0,
                    y = 0,
                    w = sic.width,
                    h = sic.height,
                    scale = 1;
                if (ratio < sicRatio) {
                    scale = sic.height / height;
                    w = sic.height * ratio;
                    x = (sic.width - w) / 2;
                }
                if (ratio > sicRatio) {
                    scale = sic.width / width;
                    h = sic.width / ratio;
                    y = (sic.height - h) / 2;
                }
                return {
                    scale, // 蒙版相对需求宽高的缩放
                    x,
                    y,
                    width: w,
                    height: h
                };
            },
            // 原图遮罩样式
            sourceImgShadeStyle() {
                let {
                    sourceImgMasking,
                    sourceImgContainer
                } = this,
                sic = sourceImgContainer,
                    sim = sourceImgMasking,
                    w = sim.width == sic.width ? sim.width : (sic.width - sim.width) / 2,
                    h = sim.height == sic.height ? sim.height : (sic.height - sim.height) / 2;
                return {
                    width: w + 'px',
                    height: h + 'px'
                };
            },
            previewStyle() {
                let {
                    width,
                    height,
                    ratio,
                    previewContainer
                } = this,
                pc = previewContainer,
                    w = pc.width,
                    h = pc.height,
                    pcRatio = w / h;
                if (ratio < pcRatio) {
                    w = pc.height * ratio;
                }
                if (ratio > pcRatio) {
                    h = pc.width / ratio;
                }
                return {
                    width: w + 'px',
                    height: h + 'px'
                };
            }
        },
        watch: {
            value(newValue) {
                if (newValue && this.loading != 1) {
                    this.reset();
                }
            }
        },
        methods: {
            setBgimg(img, taskStyle) {
                this.thisTaskStyle = taskStyle;
                this.bgImg = img.currentTarget.src
            },
            // 关闭控件
            off() {
                setTimeout(() => {
                    this.reset();
                    this.$emit('input', false);
                    this.$emit('colseUpImgShow', false)
                }, 200);
            },

            /* 图片选择区域函数绑定
             ---------------------------------------------------------------*/
            preventDefault(e) {
                e.preventDefault();
                return false;
            },
            handleClick(e) {
                if (this.loading !== 1) {
                    if (e.target !== this.$refs.fileinput) {
                        e.preventDefault();
                        if (document.activeElement !== this.$refs) {
                            this.$refs.fileinput.click();
                        }
                    }
                }
            },
            handleChange(e) {
                e.preventDefault();
                if (this.loading !== 1) {
                    let files = e.target.files || e.dataTransfer.files;
                    this.reset();
                    if (this.checkFile(files[0])) {
                        this.setSourceImg(files[0]);
                    }
                }
            },
            /* ---------------------------------------------------------------*/

            // 检测选择的文件是否合适
            checkFile(file) {
                let that = this,
                    {
                        lang,
                        maxSize
                    } = that;
                // 仅限图片
                if (file.type.indexOf('image') === -1) {
                    that.$message.error(lang.error.onlyImg)
                    return false;
                }

                // 超出大小
                if (file.size / 1024 > maxSize) {
                    that.$message.error(lang.error.outOfSize + maxSize + 'kb')
                    return false;
                }
                return true;
            },
            // 重置控件
            reset() {
                let that = this;
                that.loading = 0;
                that.progress = 0;
            },
            // 设置图片源
            setSourceImg(file) {
                this.$emit('src-file-set', file.name, file.type, file.size);
                let that = this,
                    fr = new FileReader();
                fr.onload = function (e) {
                    that.sourceImgUrl = fr.result;
                    that.startCrop();
                }
                fr.readAsDataURL(file);
            },
            // 剪裁前准备工作
            startCrop() {
                let that = this,
                    {
                        width,
                        height,
                        ratio,
                        scale,
                        sourceImgUrl,
                        sourceImgMasking,
                        lang
                    } = that,
                    sim = sourceImgMasking,
                    img = new Image();
                img.src = sourceImgUrl;
                img.onload = function () {
                    let nWidth = img.naturalWidth,
                        nHeight = img.naturalHeight,
                        nRatio = nWidth / nHeight,
                        w = sim.width,
                        h = sim.height,
                        x = 0,
                        y = 0;
                    // 图片像素不达标
                    if (nWidth < width || nHeight < height) {
                        that.$message.error(lang.error.lowestPx + width + '*' + height)
                        return false;
                    }
                    if (ratio > nRatio) {
                        h = w / nRatio;
                        y = (sim.height - h) / 2;
                    }
                    if (ratio < nRatio) {
                        w = h * nRatio;
                        x = (sim.width - w) / 2;
                    }
                    scale.range = 0;
                    scale.x = x;
                    scale.y = y;
                    scale.width = w;
                    scale.height = h;
                    scale.minWidth = w;
                    scale.minHeight = h;
                    scale.maxWidth = nWidth * sim.scale;
                    scale.maxHeight = nHeight * sim.scale;
                    scale.naturalWidth = nWidth;
                    scale.naturalHeight = nHeight;
                    that.sourceImg = img;
                    that.createImg();
                };
            },
            // 鼠标按下图片准备移动
            imgStartMove(e) {
                e.preventDefault();
                // 支持触摸事件，则鼠标事件无效
                if (this.isSupportTouch && !e.targetTouches) {
                    return false;
                }
                let et = e.targetTouches ? e.targetTouches[0] : e,
                    {
                        sourceImgMouseDown,
                        scale
                    } = this,
                    simd = sourceImgMouseDown;
                simd.mX = et.screenX;
                simd.mY = et.screenY;
                simd.x = scale.x;
                simd.y = scale.y;
                simd.on = true;
            },
            // 鼠标按下状态下移动，图片移动
            imgMove(e) {
                e.preventDefault();
                // 支持触摸事件，则鼠标事件无效
                if (this.isSupportTouch && !e.targetTouches) {
                    return false;
                }
                let et = e.targetTouches ? e.targetTouches[0] : e,
                    {
                        sourceImgMouseDown: {
                            on,
                            mX,
                            mY,
                            x,
                            y
                        },
                        scale,
                        sourceImgMasking
                    } = this,
                    sim = sourceImgMasking,
                    nX = et.screenX,
                    nY = et.screenY,
                    dX = nX - mX,
                    dY = nY - mY,
                    rX = x + dX,
                    rY = y + dY;
                if (!on) return;
                if (rX > 0) {
                    rX = 0;
                }
                if (rY > 0) {
                    rY = 0;
                }
                if (rX < sim.width - scale.width) {
                    rX = sim.width - scale.width;
                }
                if (rY < sim.height - scale.height) {
                    rY = sim.height - scale.height;
                }
                scale.x = rX;
                scale.y = rY;
            },
            handleMouseWheel(e) {
                e = e || window.event;
                let {
                    scale
                } = this;
                if (e.wheelDelta) { //判断浏览器IE，谷歌滑轮事件
                    if (e.wheelDelta > 0) { //当滑轮向上滚动时
                        this.zoomImg(scale.range >= 100 ? 100 : ++scale.range);
                    }
                    if (e.wheelDelta < 0) {
                        this.zoomImg(scale.range <= 0 ? 0 : --scale.range);
                    }
                } else if (e.detail) { //Firefox滑轮事件
                    if (e.detail > 0) { //当滑轮向上滚动时
                        this.zoomImg(scale.range >= 100 ? 100 : ++scale.range);
                    }
                    if (e.detail < 0) {
                        this.zoomImg(scale.range <= 0 ? 0 : --scale.range);
                    }
                }
            },
            // 按钮按下开始放大
            startZoomAdd(e) {
                let that = this,
                    {
                        scale
                    } = that;
                scale.zoomAddOn = true;

                function zoom() {
                    if (scale.zoomAddOn) {
                        let range = scale.range >= 100 ? 100 : ++scale.range;
                        that.zoomImg(range);
                        setTimeout(function () {
                            zoom();
                        }, 60);
                    }
                }
                zoom();
            },
            // 按钮松开或移开取消放大
            endZoomAdd(e) {
                this.scale.zoomAddOn = false;
            },
            // 按钮按下开始缩小
            startZoomSub(e) {
                let that = this,
                    {
                        scale
                    } = that;
                scale.zoomSubOn = true;

                function zoom() {
                    if (scale.zoomSubOn) {
                        let range = scale.range <= 0 ? 0 : --scale.range;
                        that.zoomImg(range);
                        setTimeout(function () {
                            zoom();
                        }, 60);
                    }
                }
                zoom();
            },
            // 按钮松开或移开取消缩小
            endZoomSub(e) {
                let {
                    scale
                } = this;
                scale.zoomSubOn = false;
            },
            zoomChange(e) {
                this.zoomImg(e.target.value);
            },
            // 缩放原图
            zoomImg(newRange) {
                let that = this,
                    {
                        sourceImgMasking,
                        sourceImgMouseDown,
                        scale
                    } = this,
                    {
                        maxWidth,
                        maxHeight,
                        minWidth,
                        minHeight,
                        width,
                        height,
                        x,
                        y,
                        range
                    } = scale,
                    sim = sourceImgMasking,
                    // 蒙版宽高
                    sWidth = sim.width,
                    sHeight = sim.height,
                    // 新宽高
                    nWidth = minWidth + (maxWidth - minWidth) * newRange / 100,
                    nHeight = minHeight + (maxHeight - minHeight) * newRange / 100,
                    // 新坐标（根据蒙版中心点缩放）
                    nX = sWidth / 2 - (nWidth / width) * (sWidth / 2 - x),
                    nY = sHeight / 2 - (nHeight / height) * (sHeight / 2 - y);

                // 判断新坐标是否超过蒙版限制
                if (nX > 0) {
                    nX = 0;
                }
                if (nY > 0) {
                    nY = 0;
                }
                if (nX < sWidth - nWidth) {
                    nX = sWidth - nWidth;
                }
                if (nY < sHeight - nHeight) {
                    nY = sHeight - nHeight;
                }

                // 赋值处理
                scale.x = nX;
                scale.y = nY;
                scale.width = nWidth;
                scale.height = nHeight;
                scale.range = newRange;
                setTimeout(function () {
                    if (scale.range == newRange) {
                        that.createImg();
                    }
                }, 300);
            },
            // 生成需求图片
            createImg(e) {
                let that = this,
                    {
                        imgFormat,
                        imgBgc,
                        mime,
                        sourceImg,
                        scale: {
                            x,
                            y,
                            width,
                            height,
                        },
                        sourceImgMasking: {
                            scale
                        }
                    } = that,
                    canvas = that.$refs.canvas,
                    ctx = canvas.getContext('2d');
                if (e) {
                    // 取消鼠标按下移动状态
                    that.sourceImgMouseDown.on = false;
                }
                canvas.width = that.width;
                canvas.height = that.height;
                ctx.clearRect(0, 0, that.width, that.height);

                if (imgFormat == 'png') {
                    ctx.fillStyle = 'rgba(0,0,0,0)';
                } else {
                    // 如果jpg 为透明区域设置背景，默认白色
                    ctx.fillStyle = imgBgc;
                }
                ctx.fillRect(0, 0, that.width, that.height);

                ctx.drawImage(sourceImg, x / scale, y / scale, width / scale, height / scale);
                that.createImgUrl = canvas.toDataURL(mime);
            },
            prepareUpload() {
                if (typeof this.bgImg !== 'undefined') {
                    html2canvas(this.$refs.taskimg, {
                        backgroundColor: null
                    }).then(canvas => {
                        this.taskDataUrl = canvas.toDataURL("image/png");
                        html2canvas(this.$refs.qpimg, {
                            backgroundColor: null
                        }).then(canvas => {
                            this.qpDataUrl = canvas.toDataURL("image/png");
                            this.upload();
                        });
                    });
                } else {
                    this.$message.error('请选择背景图')
                }
            },
            // 上传图片
            upload() {
                this.reset();
                this.loading = 1;

                let fmData = new FormData();
                // 将field的添加放到表单域的最后，以支持阿里云OSS的表单上传
                fmData.append(this.field, data2blob(this.taskDataUrl, this.mime), this.field + '.' + this.imgFormat);
                this.postImg(fmData, 'task')

                let fmData1 = new FormData();
                // 将field的添加放到表单域的最后，以支持阿里云OSS的表单上传
                fmData1.append(this.field, data2blob(this.qpDataUrl, this.mime), this.field + '.' + this.imgFormat);
                this.postImg(fmData1, 'qp')
            },
            // 上传图片
            postImg(fmData, type = 'task') {
                let that = this;
                // 监听进度回调
                const uploadProgress = function (event) {
                    if (event.lengthComputable) {
                        that.progress = 100 * Math.round(event.loaded) / event.total;
                    }
                };
                new Promise(function (resolve, reject) {
                    let client = new XMLHttpRequest();
                    client.open(that.method, that.url, true);
                    client.withCredentials = that.withCredentials;
                    client.onreadystatechange = function () {
                        if (this.readyState !== 4) {
                            return;
                        }
                        if (this.status === 200 || this.status === 201 || this.staus === 202) {
                            resolve(JSON.parse(this.responseText));
                        } else {
                            reject(this.status);
                        }
                    };
                    client.upload.addEventListener("progress", uploadProgress, false); //监听进度
                    client.send(fmData);
                }).then(
                    // 上传成功
                    function (resData) {
                        if (that.value) {
                            that.loading++;
                            that.$emit('crop-upload-success', resData, type);
                            if (that.loading == 3) {
                                that.$message({
                                    type: 'success',
                                    message: '上传成功'
                                })
                                that.off();
                            }
                        }
                    },
                    // 上传失败
                    function (sts) {
                        if (that.value) {
                            that.$emit('crop-upload-fail', sts, type);
                            that.$message.error(that.lang.fail + ':' + type + '|' + sts)
                        }
                    }
                );
            }
        },
        mounted() {
            if (this.sourceImgUrl) {
                this.startCrop();
            }
        }
    }

</script>
<style lang="scss" scoped>
    .vue-image-upload {

        .vicp-crop-img {

            .vicp-img-container {
                position: relative;
                display: block;
                width: 220px;
                height: 200px;
                background-color: #e5e5e0;
                overflow: hidden;


                .vicp-img {
                    position: absolute;
                    display: block;
                    cursor: move;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }

                .vicp-img-shade {
                    -webkit-box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.18);
                    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.18);
                    position: absolute;
                    background-color: rgba(241, 242, 243, 0.8);
                }

                .vicp-img-shade.vicp-img-shade-1 {
                    top: 0;
                    left: 0;
                }

                .vicp-img-shade.vicp-img-shade-2 {
                    bottom: 0;
                    right: 0;
                }
            }

            .vicp-range {
                position: relative;
                width: 200px;
                height: 200px;
                transform: rotate(-90deg);


                .vicp-icon5,
                .vicp-icon6 {
                    position: absolute;
                    top: 0;
                    width: 18px;
                    height: 18px;
                    border-radius: 100%;
                    background-color: rgba(0, 0, 0, 0.08);
                }

                .vicp-icon5:hover,
                .vicp-icon6:hover {
                    -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12);
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12);
                    cursor: pointer;
                    background-color: rgba(0, 0, 0, 0.14);
                }

                .vicp-icon5 {
                    left: 0;
                }

                .vicp-icon5::before {
                    position: absolute;
                    content: '';
                    display: block;
                    left: 3px;
                    top: 8px;
                    width: 12px;
                    height: 2px;
                    background-color: #fff;
                }

                .vicp-icon6 {
                    right: 0;
                }

                .vicp-icon6::before {
                    position: absolute;
                    content: '';
                    display: block;
                    left: 3px;
                    top: 8px;
                    width: 12px;
                    height: 2px;
                    background-color: #fff;
                }

                .vicp-icon6::after {
                    position: absolute;
                    content: '';
                    display: block;
                    top: 3px;
                    left: 8px;
                    width: 2px;
                    height: 12px;
                    background-color: #fff;
                }

                input[type=range] {
                    display: block;
                    padding-top: 5px;
                    margin: 0 auto;
                    width: 160px;
                    height: 8px;
                    vertical-align: top;
                    background: transparent;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                    cursor: pointer;
                    /* 滑块 ---------------------------------------------------------------*/
                    /* 轨道 ---------------------------------------------------------------*/
                }

                input[type=range]:focus {
                    outline: none;
                }

                input[type=range]::-webkit-slider-thumb {
                    -webkit-box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.18);
                    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.18);
                    -webkit-appearance: none;
                    appearance: none;
                    margin-top: -3px;
                    width: 12px;
                    height: 12px;
                    background-color: #61c091;
                    border-radius: 100%;
                    border: none;
                    -webkit-transition: 0.2s;
                    transition: 0.2s;
                }

                input[type=range]::-moz-range-thumb {
                    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.18);
                    -moz-appearance: none;
                    appearance: none;
                    width: 12px;
                    height: 12px;
                    background-color: #61c091;
                    border-radius: 100%;
                    border: none;
                    -webkit-transition: 0.2s;
                    transition: 0.2s;
                }

                input[type=range]::-ms-thumb {
                    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.18);
                    appearance: none;
                    width: 12px;
                    height: 12px;
                    background-color: #61c091;
                    border: none;
                    border-radius: 100%;
                    -webkit-transition: 0.2s;
                    transition: 0.2s;
                }

                input[type=range]:active::-moz-range-thumb {
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.23);
                    width: 14px;
                    height: 14px;
                }

                input[type=range]:active::-ms-thumb {
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.23);
                    width: 14px;
                    height: 14px;
                }

                input[type=range]:active::-webkit-slider-thumb {
                    -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.23);
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.23);
                    margin-top: -4px;
                    width: 14px;
                    height: 14px;
                }

                input[type=range]::-webkit-slider-runnable-track {
                    -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12);
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12);
                    width: 100%;
                    height: 6px;
                    cursor: pointer;
                    border-radius: 2px;
                    border: none;
                    background-color: rgba(68, 170, 119, 0.3);
                }

                input[type=range]::-moz-range-track {
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12);
                    width: 100%;
                    height: 6px;
                    cursor: pointer;
                    border-radius: 2px;
                    border: none;
                    background-color: rgba(68, 170, 119, 0.3);
                }

                input[type=range]::-ms-track {
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12);
                    width: 100%;
                    cursor: pointer;
                    background: transparent;
                    border-color: transparent;
                    color: transparent;
                    height: 6px;
                    border-radius: 2px;
                    border: none;
                }

                input[type=range]::-ms-fill-lower {
                    background-color: rgba(68, 170, 119, 0.3);
                }

                input[type=range]::-ms-fill-upper {
                    background-color: rgba(68, 170, 119, 0.15);
                }

                input[type=range]:focus::-webkit-slider-runnable-track {
                    background-color: rgba(68, 170, 119, 0.5);
                }

                input[type=range]:focus::-moz-range-track {
                    background-color: rgba(68, 170, 119, 0.5);
                }

                input[type=range]:focus::-ms-fill-lower {
                    background-color: rgba(68, 170, 119, 0.45);
                }

                input[type=range]:focus::-ms-fill-upper {
                    background-color: rgba(68, 170, 119, 0.25);
                }
            }
        }

        .vicp-bg-img {
            width: 60px;
            height: 60px;
            margin-right: 10px;
        }

        .task-img-box {
            width: 100px;
            height: 100px;

            box-sizing: border-box;
            background: #00000000;
            overflow: hidden;

            .border-box {
                width: 96px;
                height: 96px;
                border: 2px solid #00000000;
                z-index: 2;
                border-radius: 50%;
                position: relative;

                img.img-bg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }

                img.img-source {
                    position: absolute;
                    top: 4px;
                    left: 4px;
                    width: 88px;
                    height: 88px;
                    border-radius: 100%;
                }
            }

        }

        .qp-img-box {
            width: 140px;
            height: 109px;
            position: relative;

            img.img-bg {
                position: absolute;
                top: 0;
                left: 24px;
                width: 92px;
                height: 92px;
            }

            img.img-source {
                position: absolute;
                top: 14px;
                left: 35px;
                width: 70px;
                height: 70px;
                border-radius: 100%;
            }

            .img-money {
                position: absolute;
                top: 0;
                right: 0;
                width: 81px;
                height: 26px;
                line-height: 26px;
                text-align: center;
                background: #FF0200;
                border-radius: 13px 13px 13px 0px;
                font-size: 18px;
                color: #FFFFFF;
                z-index: 2;
            }

            .img-btn {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 140px;
                height: 39px;
                line-height: 39px;
                text-align: center;
                // background: linear-gradient(0deg, #79E2FF, #29DEFF);
                border-radius: 20px;
                font-size: 24px;
                color: #FFFFFF;
                z-index: 2;
            }

        }

    }

</style>
