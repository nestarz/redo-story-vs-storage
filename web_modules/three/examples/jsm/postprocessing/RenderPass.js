import"../../../../three.js";import{P as e}from"../../../../common/Pass-571863b2.js";var r=function(r,t,a,i,o){e.call(this),this.scene=r,this.camera=t,this.overrideMaterial=a,this.clearColor=i,this.clearAlpha=void 0!==o?o:0,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1};r.prototype=Object.assign(Object.create(e.prototype),{constructor:r,render:function(e,r,t){var a,i,o,l=e.autoClear;e.autoClear=!1,void 0!==this.overrideMaterial&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor&&(a=e.getClearColor().getHex(),i=e.getClearAlpha(),e.setClearColor(this.clearColor,this.clearAlpha)),this.clearDepth&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor&&e.setClearColor(a,i),void 0!==this.overrideMaterial&&(this.scene.overrideMaterial=o),e.autoClear=l}});export{r as RenderPass};
//# sourceMappingURL=RenderPass.js.map
