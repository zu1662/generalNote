<template>
  <div class="container">
    <a-row>
      <a-col>
        <a-upload v-model:file-list="fileList" :before-upload="beforeUpload" @change="handleChange" @remove="onRemove"
          accept=".map" :max-count="1">
          <a-button>
            <upload-outlined />
            上传sourcemap(.map)文件
          </a-button>
        </a-upload>
      </a-col>
      <a-col v-if="file">
        <span>&nbsp;&nbsp;&nbsp;&nbsp;行/列：</span>
        <a-input size="middle" style="width: 350px;" v-model:value="ruleForm.pos"
          placeholder="请输入行号和列号，以:(中文或者英文都可以)分割"></a-input>
        &nbsp;&nbsp;
        <a-button size="middle" @click="formSubmit" :loading="parsing" :disabled="parsing || !file || !ruleForm.pos">
          解析
        </a-button>
      </a-col>
    </a-row>

    <a-row style="padding: 10px;"
      v-if="file && (parseResult.line || parseResult.column || parseResult.name || parseResult.source)">
      <a-statistic title="行" :value="parseResult.line" style="margin-right: 50px" />
      <a-statistic title="列" :value="parseResult.column" style="margin-right: 50px" />
      <a-statistic title="名称" :value="parseResult.name" style="margin-right: 50px" />
      <a-statistic title="源" :value="parseResult.source" style="margin-right: 50px" />
    </a-row>

    <codemirror ref="codemi" v-if="code" v-model="code" :disabled="true" :indent-with-tab="true" :tab-size="4"
      height="200px" :specialCharPlaceholder="specialCharPlaceholder" :gutters="gutters" :styleActiveLine="true"
      :extensions="extensions" @ready="handleReady" />
  </div>
</template>

<script setup>
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'

import { EditorState } from '@codemirror/state'

import { ref, defineProps, onMounted, reactive, defineEmits, shallowRef } from "vue";

import { UploadOutlined } from '@ant-design/icons-vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'closeDialog'
]);


function specialCharPlaceholder(data) {
  console.log("data");
  console.log(data);
}

let gutters = reactive(["CodeMirror-linenumbers", "CodeMirror-foldgutter"])

let parsing = ref(false),
  file = ref(""),
  code = ref("console.log(\"hello 天穹!!!\");\""),
  fileList = ref([]),
  ruleForm = reactive({
    pos: ''
  }),
  rules = reactive({
    pos: [
      { required: true, message: '请输入行号和列号，以:分割，中英文都可以', trigger: 'blur' }
    ]
  }),
  extensions = [javascript(), oneDark],
  parseResult = reactive({}),
  view = shallowRef(),
  state = shallowRef(),
  codemi = ref(null)

const handleReady = (payload) => {
  console.log("payload");
  console.log(payload);
  view.value = payload.view
  state.value = payload.state
}

function handleChange(info) {
  if (info.file.status === 'done') {
    fileList.value = info.fileList
    file.value = info.file;
    window._message.success(`${info.file.name} 文件上传成功~！`)
  } else if (info.file.status === 'error') {
    window._message.error(`${info.file.name} 文件上传失败，请重试~！`)
  }
}

function onRemove() {
  file.value = "";
  fileList.value = [];
}

function beforeUpload(f) {
  fileList.value = [...fileList.value, f];
  file.value = f;
  return false;
}

// Status is available at all times via Codemirror EditorView
const getCodemirrorStates = () => {
  const state = view.value.state
  const ranges = state.selection.ranges
  const selected = ranges.reduce((r, range) => r + range.to - range.from, 0)
  const cursor = ranges[0].anchor
  const length = state.doc.length
  const lines = state.doc.lines
  debugger
  // more state info ...
  // return ...
}

function formSubmit() {

  let [line, column] = ruleForm.pos.split(/[:,：]/);

  if (!line || !column) {
    window._message.error(`行号或列号不完整，请重新输入~！`)
    return false;
  }

  if (!file.value) {
    window._message.error(`请上传sourcemap文件！`)
    return false;
  }

  // 读取文件
  const fileReader = new FileReader();

  fileReader.onloadend = () => {
    let rawSourceMap = fileReader.result;
    try {
      rawSourceMap = JSON.parse(rawSourceMap)
    } catch (e) {
      parsing = false;
      window._message.error(`上传.map文件内容异常！`)
      return false
    }

    if (parsing.value) return false;

    parsing.value = true;

    window.sourceMap.SourceMapConsumer.with(rawSourceMap, null, (consumer) => {
      try {
        const res = consumer.originalPositionFor({
          source: "./",
          line: +line,
          column: +column
        });

        code.value = consumer.sourceContentFor(res.source, true);

        if (!code.value) {
          parsing.value = false;
          return false;
        }

        if (res.line && res.column) {
          // EditorState.({line: res.line, ch: res.column})
        }

        parseResult.line = res.line
        parseResult.column = res.column
        parseResult.name = res.name
        parseResult.source = res.source


        console.log("view");
        console.log(view);

        parsing.value = false;
      } catch (e) {
        console.log(e.message)
        window._message.error(`解析sourcemap失败，请确保信息输入正确~！`)
        code.value = "";
      }
      parsing.value = false;
    });

  }
  fileReader.readAsText(file.value);
  return false;
}

onMounted(() => {
  window.sourceMap.SourceMapConsumer.initialize({
    "lib/mappings.wasm": "https://unpkg.com/source-map@0.7.3/lib/mappings.wasm"
  });
})

function closeDialog() {
  code.value = "";
  file.value = ""
  fileList.value = [];
  ruleForm.pos = ""
  parseResult.line = ""
  parseResult.column = ""
  parseResult.name = ""
  parseResult.source = ""
  emit("closeDialog", props.visible)
}

</script>

<style>
.container {
  padding: 20px;
}

.v-codemirror>.cm-editor {
  margin-top: 10px;
  max-height: 800px;
}

.a-upload-list__item {
  transition: none !important;
  -webkit-transition: none !important;
}

.a-upload-list__item-name {
  transition: none !important;
  -webkit-transition: none !important;
}

.CodeMirror-selectedtext {
  background: red !important;
  color: #fff !important;
}

.CodeMirror {
  border: 1px solid #eee;
  height: auto;
}
</style>
<style>
.code {
  margin-top: 10px;
}

.el-upload__tip {
  margin-left: 20px;
  color: red;
}

</style>