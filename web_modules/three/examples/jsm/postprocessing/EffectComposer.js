import{ShaderMaterial as e,UniformsUtils as t,Vector2 as s,WebGLRenderTarget as r,Clock as i,OrthographicCamera as n,PlaneBufferGeometry as h,LinearFilter as a,RGBAFormat as o,Mesh as f}from"../../../../three.js";import{C as d}from"../../../../common/CopyShader-9fb51d10.js";import{P as c}from"../../../../common/Pass-571863b2.js";var u=function(s,r){c.call(this),this.textureID=void 0!==r?r:"tDiffuse",s instanceof e?(this.uniforms=s.uniforms,this.material=s):s&&(this.uniforms=t.clone(s.uniforms),this.material=new e({defines:Object.assign({},s.defines),uniforms:this.uniforms,vertexShader:s.vertexShader,fragmentShader:s.fragmentShader})),this.fsQuad=new c.FullScreenQuad(this.material)};u.prototype=Object.assign(Object.create(c.prototype),{constructor:u,render:function(e,t,s){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=s.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}});var l=function(e,t){c.call(this),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1};l.prototype=Object.assign(Object.create(c.prototype),{constructor:l,render:function(e,t,s){var r,i,n=e.getContext(),h=e.state;h.buffers.color.setMask(!1),h.buffers.depth.setMask(!1),h.buffers.color.setLocked(!0),h.buffers.depth.setLocked(!0),this.inverse?(r=0,i=1):(r=1,i=0),h.buffers.stencil.setTest(!0),h.buffers.stencil.setOp(n.REPLACE,n.REPLACE,n.REPLACE),h.buffers.stencil.setFunc(n.ALWAYS,r,4294967295),h.buffers.stencil.setClear(i),h.buffers.stencil.setLocked(!0),e.setRenderTarget(s),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),h.buffers.color.setLocked(!1),h.buffers.depth.setLocked(!1),h.buffers.stencil.setLocked(!1),h.buffers.stencil.setFunc(n.EQUAL,1,4294967295),h.buffers.stencil.setOp(n.KEEP,n.KEEP,n.KEEP),h.buffers.stencil.setLocked(!0)}});var p=function(){c.call(this),this.needsSwap=!1};p.prototype=Object.create(c.prototype),Object.assign(p.prototype,{render:function(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}});var g=function(e,t){if(this.renderer=e,void 0===t){var n={minFilter:a,magFilter:a,format:o,stencilBuffer:!1},h=e.getSize(new s);this._pixelRatio=e.getPixelRatio(),this._width=h.width,this._height=h.height,(t=new r(this._width*this._pixelRatio,this._height*this._pixelRatio,n)).texture.name="EffectComposer.rt1"}else this._pixelRatio=1,this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],void 0===d&&console.error("THREE.EffectComposer relies on CopyShader"),void 0===u&&console.error("THREE.EffectComposer relies on ShaderPass"),this.copyPass=new u(d),this.clock=new i};Object.assign(g.prototype,{swapBuffers:function(){var e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e},addPass:function(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)},insertPass:function(e,t){this.passes.splice(t,0,e)},isLastEnabledPass:function(e){for(var t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0},render:function(e){void 0===e&&(e=this.clock.getDelta());var t,s,r=this.renderer.getRenderTarget(),i=!1,n=this.passes.length;for(s=0;s<n;s++)if(!1!==(t=this.passes[s]).enabled){if(t.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),t.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),t.needsSwap){if(i){var h=this.renderer.getContext(),a=this.renderer.state.buffers.stencil;a.setFunc(h.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),a.setFunc(h.EQUAL,1,4294967295)}this.swapBuffers()}void 0!==l&&(t instanceof l?i=!0:t instanceof p&&(i=!1))}this.renderer.setRenderTarget(r)},reset:function(e){if(void 0===e){var t=this.renderer.getSize(new s);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,(e=this.renderTarget1.clone()).setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2},setSize:function(e,t){this._width=e,this._height=t;var s=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(s,r),this.renderTarget2.setSize(s,r);for(var i=0;i<this.passes.length;i++)this.passes[i].setSize(s,r)},setPixelRatio:function(e){this._pixelRatio=e,this.setSize(this._width,this._height)}});var m,b,_,w=function(){this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1};Object.assign(w.prototype,{setSize:function(){},render:function(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}}),w.FullScreenQuad=(m=new n(-1,1,1,-1,0,1),b=new h(2,2),_=function(e){this._mesh=new f(b,e)},Object.defineProperty(_.prototype,"material",{get:function(){return this._mesh.material},set:function(e){this._mesh.material=e}}),Object.assign(_.prototype,{dispose:function(){this._mesh.geometry.dispose()},render:function(e){e.render(this._mesh,m)}}),_);export{g as EffectComposer,w as Pass};
//# sourceMappingURL=EffectComposer.js.map
