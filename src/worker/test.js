const { parentPort } = require('worker_threads');

parentPort?.on('message', res => {
  console.log(res);
  // parentPort?.postMessage('heyhey');
})