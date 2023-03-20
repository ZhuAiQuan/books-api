const js_basic = [
  {
    title: "js运行机制",
    content:
      "js是单线程的语言，事件的运行机制分为同步任务和异步任务。同步任务为直接执行的任务，异步任务为放入事件队列的任务，等同步任务先执行再执行异步任务。异步任务又分为宏任务和微任务，宏任务常见的为整体的script代码，定时器，ajax请求等；微任务常见为promise, async await,process.nextTick等。先执行微任务，再执行宏任务。",
  },
  {
    title: "js作用域",
    content:
      "作用域是指js里变量，对象，函数的可访问性。简单说就是作用域是指变量的使用范围，就是说代码在那些范围里可以访问这个变量。作用域就是代码的执行环境，又分为全局作用域和局部作用域，全局作用域就是全局代码执行环境，局部作用域就是函数执行环境。全局作用域顾名思义就是所有变量都能访问到的作用域，比如最外层根环境。局部作用域在es6之前只有函数作用域，就是说函数内部的作用域。es6新增了块级作用域，即用{}包裹 使用let const声明的变量。作用域链：多个作用域对象连续引用的链式结构。通俗点讲跟原型链的方式差不多，在当前局部环境查找一个变量如果没有找到，就会向上一个作用域查找，以此类推直到全局作用域，如果还没有找到就会报错。",
  },
  {
    title: "闭包",
    content:
      "闭包，概念上来说是一个可以访问自由变量的函数。比如在一个函数里返回了另一个函数，这个函数使用了外面函数里的变量并被引用，而外部函数执行了垃圾回收，但外部函数的变量仍然可以被访问到，这就形成了一个闭包。利用闭包特性可以创建许多的特色功能，比如防抖节流之类的，比较出名的比如react的useState hooks，vue的setup等；当然滥用闭包的话会导致垃圾回收不到，造成内存泄漏。",
  },
  {
    title: "原型链",
    content:
      "在js里，每一个函数（非箭头函数哈）都有一个prototype属性，这个属性是一个对象，指向它的原型。通过new创建一个实例，这个实例有一个__proto__属性，指向它的原型。在访问这个实例的函数或者方法的时候，如果当前实例上没有，那就会向它的上一级查找，以此类推，直到null，这个查找的过程就称为原型链。",
  },
  {
    title: "模块化",
    content:
      "以前一个文件就是一个模块，这种开发方式存在很多问题。比如：没有私有作用域，存在命名冲突污染变量等。现代化的模块化开发有助于拆分代码，根据不同的功能拆分不同的代码，便于维护管理，提高开发效率。常用模块化又分为commonjs和es module两种，cjs通过module.export导出，require导入，cjs是同步导入模块，因此在浏览器端如果使用cjs那么就会存在等待一个模块导入如果时间过长会造成页面卡顿等情况。此外require导入是复制一份数据进来，因此源数据修改了不会触发复制数据的更新。es module则是es6之后推出的新的模块化规范，通过指定script type=module来声明当前为es module模块化加载。es module通过import导入，使用export导出，default默认导出。import导入是对变量的引用，修改源数据会触发引用数据更新。",
  },
  {
    title: "继承",
    content:
      "继承即一个对象继承另一个对象的属性和方法。在es6之前,只能通过寄生式组合的方式来比较完美的实现继承，即把对象的原型和this指向当前对象。而es6新增了class来实现继承，使用extends关键词来触发继承。class类里有一个constructor实例，实例里有一个super方法来继承父级的变量方法。",
  },
  {
    title: "垃圾回收",
    content:
      "js里垃圾回收机制，即会自动标记所有变量，在不使用或者是说失去引用的时候会自动标记销毁。垃圾回收策略是标记回收，分为标记阶段和清除阶段。标记阶段会标记全部标量，而清除阶段则把所有没有标记或者失去引用的数据自动销毁。",
  },
  {
    title: "promise",
    content:
      "promise是js解决回调地狱的方法，返回一个异步数据的结果。promise有三种状态，初始化Pedding状态，成功fulxxxx状态，失败rejected状态，一旦状态改变就不会再变了。promise形参是一个函数，这个函数有两个参数，一个是resolve成功的回调函数，一个是reject 失败的回到函数。通过.then方法来接收执行的结果，then方法的参数是一个函数，该函数有两个参数，第一个是返回成功的结果，第二个是返回失败的结果。通过.catch方法返回执行的错误。promise还提供了相关的方法如promise.all，promise.race等",
  },
];

const react_basic = [
  {
    title: "对hooks的看法",
    content:
      "hooks是react16.8推出的新的方法，用于弥补函数式组件没有自身的状态，导致无法像类组件那样构建有状态的组件。hooks无法在普通函数中调用，也无法在条件判断中使用。常见的hooks方法有useState, useRef, useReducer, useMemo, useEffect, useLayoutEffect, useContext等。hooks的出现，极大的丰富了react构建函数式组件的功能，提供了另一种编写组件的方式，同时去除了类组件庞大复杂的生命周期钩子函数，使用useEffect副作用来替代mounted, updated,destroy生命周期，便于维护一些监听函数并在卸载时销毁。",
  },
  {
    title: "useState和useRef的区别，使用场景",
    content:
      "从使用场景来说：useState用于函数式组件的状态，创建响应式的数据，通过传入一个初始化的数据或者函数，返回一个数组，数组第一项是对应的state状态，第二项是对应修改state状态的方法。useRef则用于获取组件实例或者组件里的dom元素或者获取子组件里的方法等。底层的话useState通过setState来改变state的值，每次setState都会触发render更新；而useRef则不会触发render更新",
  },
  {
    title: "子组件使用哪个hooks向父组件暴露方法",
    content:
      "父组件创建一个ref数据，通过fromRef高阶组件传入到子组件内部，子组件则通过useImperativeHandle的来将需要的方法暴露给父组件",
  },
  {
    title: "react使用过哪些第三方的库",
    content: "各大ui组件库，富文本编辑器wangeditor，react-dnd文件拖拽等",
  },
  {
    title: "react做过哪些权限控制",
    content:
      "路由权限控制，页面按钮级权限控制。路由权限控制思路是先配置好权限路由，登录获取token后去请求权限路由，封装一个公共的父组件用于校验权限，先判断有无token来跳转登录，再校验访问路由与权限路由是否匹配通过。按钮控制则通过公共组件里每次跳转去获取当前页面的按钮权限，再在页面控制按钮的状态是否显示。",
  },
  {
    title: "react性能优化做过哪些",
    content:
      "在react中父组件数据变化了，子组件也会一起render更新，但如果子组件不需要更新而更新了会造成不必要的性能浪费。在react中通过useMemo,pureComponent,shoudleCompoentUpdate来控制子组件是否需要更新。使用useCallback缓存传给子组件的方法。此外页面资源比如图片压缩减小加载时的资源大小让其更快加载出来，多个icon图标放到一张图片里加载以减少资源请求次数。图片封装懒加载功能，使用自身的load方法来控制是否立即加载或者延迟加载，或者使用window的intersectionObserver来监听视图是否到达可视区域来加载图片。打包构建优化，分包加载路由懒加载，gzip代码压缩，cdn加载,tree-sharking组件按需加载等",
  },
  {
    title: "代码分包怎么实现",
    content:
      "代码分包，按不同路由功能，划分不同代码块，延迟加载路由。使用webpack的优化webpack-thunk,按功能配置不同路由模块加载",
  },
  {
    title: "useEffect、useLayoutEffect的区别",
    content:
      "功能99%的相似，区别是useLayoutEffect会以同步方式来执行，会阻塞页面渲染，但是可以解决某些页面闪烁的问题。而useEffect则是异步执行，会在页面渲染后执行，所以如果setState后再再useEffect里修改，页面将会闪烁一下。需要注意的是服务端渲染不支持useLayoutEffect，会提示错误呢",
  },
  {
    title: '写过哪些自定义hooks',
    content: '防抖，节流，获取window宽高等'
  }
];

const css_basic = [
  {
    title: "em、rem区别",
    content: "em相对于父属性的fontsize,rem相对于根节点的fontsize",
  },
  {
    title: "bfc",
    content: "块级格式化内容，特性是元素内的样式不会影响元素外的样式",
  },
];

const http_basic = [
  {
    title: "http、https区别",
    content:
      "http是超文本传输协议，明文传输，在客户端和服务端之间容易被劫持获取信息，不安全。https则是http+ssl，ssl是加密协议，比http安全。https需要申请ca证书。http比https要快，http默认端口是80，https默认端口是443。http只需要经过3次握手（客户端发起请求，服务端响应请求，客户端接收数据），而https则需要3次握手+数字证书（服务端向客户端发送证书，包含了公钥，证书颁发者，有效期;客户端接收并验证证书的有效性，通过后会生成一个随机的pre-master key,再把key通过公钥加密并发送给服务端；服务端通过私钥解密得到pre-master key;客户端和服务端通过主密钥进行安全的通信）",
  },
  {
    title: "浏览器缓存",
    content:
      "浏览器请求资源的时候，会对资源进行缓存，以便于下一次请求不需要再向服务端发起请求。比如请求网页资源数据，第一次请求成功后刷新进行第二次请求，如果本地有资源数据，会从本地读取而不向服务端再请求，这就是浏览器的缓存机制。缓存又分为强缓存和协商缓存，缓存的优先级是强缓存，其次是协商缓存，最后才是向服务端重新请求。在http1.0的时候通过expries字段来控制强缓存，这是一个绝对时间，在这个时间段内不需要再请求而直接读取缓存，这有一个弊端，绝对是件是客户端的时间，如果修改了客户端时间会导致无法选中强缓存。http1.1新增了cache字段，这是一个相对值，服务端相对于客户端的时间，用于解决http1.0绝对时间再修改本地时间导致的问题。当没选中强缓存的时候，浏览器会开始判断是否为协商缓存，为协商缓存则返回304状态码并读取缓存数据。协商缓存第一次请求会在请求头添加etag或者Last-modified字段，第二次则出现对应的etag或Last-modified字段",
  },
  {
    title: "第一次请求发生什么",
    content:
      "输入域名后进行dns解析，获取到主机域名，建立tcp连接进行3次握手，向服务端发送请求，服务端相应请求并返回响应报文数据，客户端接收资源数据并开始渲染页面，断开连接。",
  },
];

const vue_basic = [
  {
    title: "setup与hooks的区别",
    content: "共同点：都是提取公共函数逻辑复用。不同点：setup只会在组件实例初始化的时候执行一次，通过闭包的方式将引用挂载在组件内部；hooks则是在组件每次render的时候调用，隐式的挂载在当前组件实例内部的节点上，在下一次render的时候根据调用顺序取出来。",
  },
  {
    title: 'vue响应式原理',
    content: 'vue2是使用Object.definePeoproty数据拦截+事件订阅来实现的。在初始化的时候在内部把data里的数据转成一个个的get,set进行依赖收集，在数据发生变动的时候通知watch来改变视图。'
  }
];

module.exports = {
  js_basic, react_basic, css_basic, http_basic, vue_basic
}
