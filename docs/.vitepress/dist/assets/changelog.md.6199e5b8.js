import{_ as s,o as a,c as l,V as n}from"./chunks/framework.1ff97459.js";const C=JSON.parse('{"title":"更新日志","description":"","frontmatter":{},"headers":[],"relativePath":"changelog.md","filePath":"changelog.md"}'),o={name:"changelog.md"},e=n(`<h1 id="更新日志" tabindex="-1">更新日志 <a class="header-anchor" href="#更新日志" aria-label="Permalink to &quot;更新日志&quot;">​</a></h1><h2 id="_1-1-0-2023-05-12" tabindex="-1">1.1.0 (2023-05-12) <a class="header-anchor" href="#_1-1-0-2023-05-12" aria-label="Permalink to &quot;1.1.0	(2023-05-12)&quot;">​</a></h2><ul><li>新增 <code>apiErrorInterception</code> API错误拦截处理程序配置项，方便用户统一拦截处理API业务异常，示例如下：</li></ul><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">msg</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;font-style:italic;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">./prompt</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#C792EA;">interface</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Data</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#F07178;">code</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">number</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">};</span></span>
<span class="line"><span style="color:#FFCB6B;">apiErrorInterception</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">data</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Data</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#A6ACCD;font-style:italic;">args</span><span style="color:#89DDFF;">?:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">UniApp</span><span style="color:#89DDFF;">.</span><span style="color:#FFCB6B;">RequestSuccessCallbackResult</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">	</span><span style="color:#89DDFF;font-style:italic;">if</span><span style="color:#F07178;"> (</span><span style="color:#A6ACCD;">data</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">code</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">!==</span><span style="color:#F07178;"> </span><span style="color:#F78C6C;">1</span><span style="color:#F07178;">) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">		</span><span style="color:#82AAFF;">msg</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> title</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">请求失败</span><span style="color:#89DDFF;">&#39;</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">	</span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span></code></pre></div><ul><li>调整 <code>errorHandleByCode</code> 配置项为非必填，简化初始化配置内容。</li></ul><h2 id="_1-0-61-2023-04-14" tabindex="-1">1.0.61 (2023-04-14) <a class="header-anchor" href="#_1-0-61-2023-04-14" aria-label="Permalink to &quot;1.0.61	(2023-04-14)&quot;">​</a></h2><ul><li>更新README说明文档</li></ul><h2 id="_1-0-6-2023-04-14" tabindex="-1">1.0.6 (2023-04-14) <a class="header-anchor" href="#_1-0-6-2023-04-14" aria-label="Permalink to &quot;1.0.6	(2023-04-14)&quot;">​</a></h2><ul><li>修复已知问题</li></ul><h2 id="_1-0-5-2023-04-14" tabindex="-1">1.0.5 (2023-04-14) <a class="header-anchor" href="#_1-0-5-2023-04-14" aria-label="Permalink to &quot;1.0.5	(2023-04-14)&quot;">​</a></h2><ul><li>修复 <code>GET</code> 请求时因小程序环境不支持 <code>URLSearchParams</code> 导致构建参数失败的bug。</li></ul><h2 id="_1-0-4-2023-04-02" tabindex="-1">1.0.4 (2023-04-02) <a class="header-anchor" href="#_1-0-4-2023-04-02" aria-label="Permalink to &quot;1.0.4	(2023-04-02)&quot;">​</a></h2><ul><li>修复自定义 <code>header</code> 不生效bug</li></ul><h2 id="_1-0-31-2023-04-02" tabindex="-1">1.0.31 (2023-04-02) <a class="header-anchor" href="#_1-0-31-2023-04-02" aria-label="Permalink to &quot;1.0.31	(2023-04-02)&quot;">​</a></h2><ul><li>新增请求参数类型 <code>RequestOptions</code> 导出</li></ul><h2 id="_1-0-3-2023-03-31" tabindex="-1">1.0.3 (2023-03-31) <a class="header-anchor" href="#_1-0-3-2023-03-31" aria-label="Permalink to &quot;1.0.3	(2023-03-31)&quot;">​</a></h2><ul><li>修复因增加 <code>tokenValue</code> 属性后没有 <code>token</code> 返回时程序中断的bug，并完善携带token的配置demo。</li></ul><h2 id="_1-0-2-2023-03-28" tabindex="-1">1.0.2 (2023-03-28) <a class="header-anchor" href="#_1-0-2-2023-03-28" aria-label="Permalink to &quot;1.0.2	(2023-03-28)&quot;">​</a></h2><ul><li>新增 <code>tokenValue</code> 属性，优化旧版本指定token存储key的非人性化方式，<code>tokenValue</code> 直接通过自己定义Promise返回最新token即可，示例如下：</li></ul><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">tokenVlaue</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">	</span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">new</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">Promise</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">resolve</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;font-style:italic;">_</span><span style="color:#89DDFF;">)</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">		</span><span style="color:#676E95;font-style:italic;">// 获取最新token演示</span></span>
<span class="line"><span style="color:#F07178;">		</span><span style="color:#C792EA;">const</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">token</span><span style="color:#F07178;">  </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">getToken</span><span style="color:#F07178;">()</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">		</span><span style="color:#A6ACCD;">token</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&amp;&amp;</span><span style="color:#F07178;"> </span><span style="color:#82AAFF;">resolve</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">token</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">	</span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span></code></pre></div><ul><li><p>新增 <code>buildQueryString</code> 属性，支持自定义构建URL参数的方式，默认使用 <code>NodeJS</code>内置对象 <code>URLSearchParams</code> 转化，可以选择 <code>qs</code> 插件方式，需要手动安装 <code>qs</code> 插件</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">// qs 插件转化示例</span></span>
<span class="line"><span style="color:#A6ACCD;">import qs from &#39;qs&#39;;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">return qs.stringify(obj);</span></span></code></pre></div></li></ul><h2 id="_1-0-1-2023-03-26" tabindex="-1">1.0.1 (2023-03-26) <a class="header-anchor" href="#_1-0-1-2023-03-26" aria-label="Permalink to &quot;1.0.1    (2023-03-26)&quot;">​</a></h2><ul><li>优化已知问题</li></ul>`,23),p=[e];function t(c,r,F,i,y,D){return a(),l("div",null,p)}const A=s(o,[["render",t]]);export{C as __pageData,A as default};
