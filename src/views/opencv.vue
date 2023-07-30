<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div>
      <input id="file" type="file" :name="files" accept="image/*" @change="newimg">
      <button @click="click">Try</button>
    </div>
    <div>
      <canvas id="srcimg" ref="srcimg" class="imgcanvas" />
      <canvas id="dstimg" ref="dstimg" class="imgcanvas" />
      <img ref="img" src="@/assets/lena_std.png" class="img">
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Main',
  props: {
    msg: {
      type: String,
      default: function() {}
    }
  },
  data() {
    return {
      faceClass: null,
      eyeClass: null,
      files: []
    }
  },
  precreate() {
  },
  created() {
    const info = this.$cv.getBuildInformation()
    console.log('main created', info, this.$cv)

    let cascadeFile = 'haarcascade_frontalface_default.xml'
    this.createFileFromURL(cascadeFile, cascadeFile, (face) => { this.faceClass = face })
    cascadeFile = 'haarcascade_eye.xml'
    this.createFileFromURL(cascadeFile, cascadeFile, (eye) => { this.eyeClass = eye })
  },
  mounted() {
    this.loadImg()
    const requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem
    console.log('requestFileSystem is ', requestFileSystem)
    if (requestFileSystem) {
      const fs = requestFileSystem(window.TEMPORARY, 1024 * 1024, (fs) => {
        const rdr = fs.root.createReader()
        // const ent = []
        rdr.readEntries((rslt) => {
          console.log(rslt)
          for (const itm of rslt) {
            console.log(itm)
          }
        })
      })
      console.log(fs)
    }
  },
  methods: {
    newimg(evt) {
      const files = evt.target.files
      if (!files.length) return
      const imgurl = URL.createObjectURL(files[0])
      const img = this.$refs.img
      img.src = imgurl
      console.log('file', files[0])
    },
    click(evt) {
      console.log('click')
      const src = this.$cv.imread(this.$refs.srcimg)
      const gray = new this.$cv.Mat()
      this.$cv.cvtColor(src, gray, this.$cv.COLOR_RGBA2GRAY)
      const faces = new this.$cv.RectVector()
      const eyes = new this.$cv.RectVector()
      const msize = new this.$cv.Size(0, 0)
      // 框选
      this.faceClass.detectMultiScale(gray, faces, 1.1, 3, 0, msize, msize)
      for (let i = 0; i < faces.size(); i++) {
        const roiGray = gray.roi(faces.get(i))
        const roiSrc = src.roi(faces.get(i))
        const point1 = new this.$cv.Point(faces.get(i).x, faces.get(i).y)
        const point2 = new this.$cv.Point(faces.get(i).x + faces.get(i).width,
          faces.get(i).y + faces.get(i).height)
        this.$cv.rectangle(src, point1, point2, [255, 0, 0, 255])
        // 框选眼镜
        this.eyeClass.detectMultiScale(roiGray, eyes)
        for (let j = 0; j < eyes.size(); ++j) {
          const point1 = new this.$cv.Point(eyes.get(j).x, eyes.get(j).y)
          const point2 = new this.$cv.Point(eyes.get(j).x + eyes.get(j).width,
            eyes.get(j).y + eyes.get(j).height)
          this.$cv.rectangle(roiSrc, point1, point2, [0, 0, 255, 255])
        }
        roiGray.delete()
        roiSrc.delete()
      }
      this.$cv.imshow(this.$refs.dstimg, src)
      src.delete()
      gray.delete()
      faces.delete()
      eyes.delete()
    },
    createFileFromURL(file, url, cb) {
      axios.get('/models/haarcascades/' + url)
        .then((resp) => {
          let rtn = this.$cv.FS_createDataFile('/', file, resp.data, true, false, false)
          if (!rtn) return cb(null)
          const classifier = new this.$cv.CascadeClassifier()
          rtn = classifier.load(file)
          if (!rtn) return cb(null)

          cb(classifier)
          // eslint-disable-next-line
        console.log('loaded', rtn, classifier.empty(), this.faceClass)
        })
        .catch((err) => {
        // eslint-disable-next-line
        console.log('ERR',err);
        })
    },
    loadImg() {
      const src = this.$refs.srcimg
      const ctx = src.getContext('2d')
      const img = this.$refs.img // new Image()

      img.onload = function() {
        src.height = img.height
        src.width = img.width
        ctx.drawImage(img, 0, 0)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.imgcanvas {
  width: 256px;
  height: 256px;
  border: 2px solid #000;
  margin: 10px;
}
.img {
  visibility: hidden;
}
#file {
  float: left;
}
</style>
