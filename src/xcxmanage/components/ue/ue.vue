<template>
    <div>
        <script id="editor" type="text/plain"></script>
    </div>
</template>
<script>
export default {
  name: 'UE',
  props: {
    value: {
      type: String
    }
  },
  data () {
    return {
      editor: null,
      config: {initialFrameWidth: null, initialFrameHeight: 350, zIndex: 4000}
    }
  },
  mounted () {
    this.editor = UE.getEditor('editor', this.config)
    this.editor.addListener('ready', () => {
      this.editor.setContent(this.value)
    })
    this.editor.addListener('contentChange', () => {
      this.$emit('input', this.editor.getContent())
    })
  },
  methods: {
    getUEContent () { // 获取内容方法
      return this.editor.getContent()
    }
  },
  watch: {
    value (value) {
      if (this.editor.getContent() != value) this.editor.setContent(value)
    }
  },
  destroyed () {
    this.editor.destroy()
  }
}
</script>
