<template>
    <div>
        <div>
            <p>请将摄像头对准患者脸部</p>
            <video id="video" style="transform:rotateY(180deg)" autoplay></video>
        </div>
        <div>
            <p>检测人脸结果</p>
            <canvas id="canvas" width="200" height="200" style="transform:rotateY(180deg)"></canvas>
        </div>
    </div>
</template>

<script>
import { userMedia } from '../utils/utils'
require('tracking/build/tracking-min.js')
require('tracking/build/data/face-min.js')

export default {
    data() {
        return {
            videoObj: null,
            trackerTask: null
        }
    },
    mounted() {
        this.openCamera()
    },
    methods: {
        openCamera() {
            // 有可能触发一些其他的按钮会重新获取
            this.$nextTick(() => {
                const canvas = document.getElementById('canvas')
                const context = canvas.getContext('2d')
                this.videoObj = document.getElementById('video')
                // eslint-disable-next-line no-undef
                const tracker = new tracking.ObjectTracker('face') // 检测人脸
                tracker.setInitialScale(4)
                tracker.setStepSize(2)
                tracker.setEdgesDensity(0.1)

                // eslint-disable-next-line no-undef
                this.trackerTask = tracking.track('#video', tracker, { camera: true })

                const constraints = {
                    video: { width: 200, height: 200 },
                    audio: false
                }

                userMedia(constraints, this.success, this.error)

                tracker.on('track', (event) => {
                    event.data.forEach((rect) => {
                        // 绘制到 canvas
                        context.drawImage(this.videoObj, 0, 0, canvas.width, canvas.height)
                        context.font = '16px Helvetica'
                        context.strokeStyle = '#1890ff'
                        context.strokeRect(rect.x, rect.y, rect.width, rect.height)
                    })

                    if (event.data.length !== 0) {
                        // 说明检测到人脸了，此时就可以截取图片传递给后端
                        // canvas 调用 toDataURL
                    }
                })
            })
        },

        handleCancel() {
            this.videoObj.srcObject.getTracks()[0].stop()
            this.trackerTask.stop()
        },

        // 成功显示
        success(stream) {
            this.videoObj.srcObject = stream
            this.videoObj.play()
        },
        // 失败抛出错误，可能用户电脑没有摄像头，或者摄像头权限没有打开
        error(error) {
            // 可以在这里面提示用户
            console.log(`访问用户媒体设备失败${error.name}, ${error.message}`)
        }
    },
    beforeDestroy() {
        this.handleCancel()
    }
}

</script>