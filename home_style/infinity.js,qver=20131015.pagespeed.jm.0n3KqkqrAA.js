(function($){var Scroller,ajaxurl,stats,type,text,totop,timer;var isIE=(-1!=navigator.userAgent.search('MSIE'));if(isIE){var IEVersion=navigator.userAgent.match(/MSIE\s?(\d+)\.?\d*;/);var IEVersion=parseInt(IEVersion[1]);}
Scroller=function(settings){var self=this;this.id=settings.id;this.body=$(document.body);this.window=$(window);this.element=$('#'+settings.id);this.wrapperClass=settings.wrapper_class;this.ready=true;this.disabled=false;this.page=1;this.offset=settings.offset;this.currentday=settings.currentday;this.order=settings.order;this.throttle=false;this.handle='<div id="infinite-handle"><span>'+text.replace('\\','')+'</span></div>';this.google_analytics=settings.google_analytics;this.history=settings.history;this.origURL=window.location.href;this.footer=$('#infinite-footer');this.footer.wrap=settings.footer;if(type=='scroll'){this.window.bind('scroll.infinity',function(){this.throttle=true;});self.gotop();setInterval(function(){if(this.throttle){this.throttle=false;self.thefooter();self.refresh();}},300);self.ensureFilledViewport();this.body.bind('post-load',{self:self},self.checkViewportOnLoad);}else if(type=='click'){this.element.append(self.handle);this.element.delegate('#infinite-handle','click.infinity',function(){$('#infinite-handle').remove();self.refresh();});}};Scroller.prototype.check=function(){var bottom=this.window.scrollTop()+this.window.height(),threshold=this.element.offset().top+this.element.outerHeight(false)-this.window.height();threshold=Math.round(threshold*0.75);return bottom>threshold;};Scroller.prototype.render=function(response){this.body.addClass('infinity-success');this.element.append(response.html);this.body.trigger('post-load');this.ready=true;};Scroller.prototype.query=function(){return{page:this.page,currentday:this.currentday,order:this.order,scripts:window.infiniteScroll.settings.scripts,styles:window.infiniteScroll.settings.styles,query_args:window.infiniteScroll.settings.query_args,last_post_date:window.infiniteScroll.settings.last_post_date,};};Scroller.prototype.gotop=function(){var blog=$('#infinity-blog-title');blog.attr('title',totop);blog.bind('click',function(e){$('html, body').animate({scrollTop:0},'fast');e.preventDefault();});};Scroller.prototype.thefooter=function(){var self=this,width;if($.type(this.footer.wrap)==="string"){width=$('body #'+this.footer.wrap).outerWidth(false);if(width>479)
this.footer.find('.container').css('width',width);}
if(this.window.scrollTop()>=350)
self.footer.animate({'bottom':0},'fast');else if(this.window.scrollTop()<350)
self.footer.animate({'bottom':'-50px'},'fast');};Scroller.prototype.refresh=function(){var self=this,query,jqxhr,load,loader,color;if(this.disabled||!this.ready||!this.check())
return;this.ready=false;loader='<span class="infinite-loader"></span>';this.element.append(loader);loader=this.element.find('.infinite-loader');color=loader.css('color');try{loader.spin('medium-left',color);}catch(error){}
query=$.extend({action:'infinite_scroll'},this.query());jqxhr=$.get(infiniteScroll.settings.ajaxurl,query);jqxhr.fail(function(){loader.hide();self.ready=true;});jqxhr.done(function(response){loader.hide();if(!response)
return;response=$.parseJSON(response);if(!response||!response.type)
return;if(response.type=='empty'){self.disabled=true;self.body.addClass('infinity-end').removeClass('infinity-success');}else if(response.type=='success'){if(response.scripts){$(response.scripts).each(function(){window.infiniteScroll.settings.scripts.push(this.handle);if(this.extra_data){var data=document.createElement('script'),dataContent=document.createTextNode("//<![CDATA[ \n"+this.extra_data+"\n//]]>");data.type='text/javascript';data.appendChild(dataContent);document.getElementsByTagName(this.footer?'body':'head')[0].appendChild(data);}
var script=document.createElement('script');script.type='text/javascript';script.src=this.src;script.id=this.handle;document.getElementsByTagName(this.footer?'body':'head')[0].appendChild(script);});}
if(response.styles){$(response.styles).each(function(){window.infiniteScroll.settings.styles.push(this.handle);var style=document.createElement('link');style.rel='stylesheet';style.href=this.src;style.id=this.handle+'-css';if(this.conditional&&(!isIE||!eval(this.conditional.replace(/%ver/g,IEVersion))))
var style=false;if(style)
document.getElementsByTagName('head')[0].appendChild(style);});}
self.page++;if(stats)
new Image().src=document.location.protocol+'//stats.wordpress.com/g.gif?'+stats+'&post=0&baba='+Math.random();if('object'==typeof response.postflair&&'object'==typeof WPCOM_sharing_counts)
WPCOM_sharing_counts=$.extend(WPCOM_sharing_counts,response.postflair);self.render.apply(self,arguments);if(type=='click'&&!response.lastbatch)
self.element.append(self.handle);if(response.currentday)
self.currentday=response.currentday;if(self.google_analytics&&'object'==typeof _gaq)
_gaq.push(['_trackPageview',self.history.path.replace(/%d/,self.page)]);}});return jqxhr;};Scroller.prototype.ensureFilledViewport=function(){var self=this,windowHeight=self.window.height(),postsHeight=self.element.height()
aveSetHeight=0,wrapperQty=0;if(postsHeight===0){$(self.element.selector+' > li').each(function(){postsHeight+=$(this).height();});if(postsHeight===0){self.body.unbind('post-load',self.checkViewportOnLoad);return;}}
$('.'+self.wrapperClass).each(function(){aveSetHeight+=$(this).height();wrapperQty++;});if(wrapperQty>0)
aveSetHeight=aveSetHeight/wrapperQty;else
aveSetHeight=0;if(postsHeight<windowHeight&&(postsHeight+aveSetHeight<windowHeight)){self.ready=true;self.refresh();}
else{self.body.unbind('post-load',self.checkViewportOnLoad);}}
Scroller.prototype.checkViewportOnLoad=function(ev){ev.data.self.ensureFilledViewport();}
Scroller.prototype.determineURL=function(){var self=window.infiniteScroll.scroller,windowTop=$(window).scrollTop(),windowBottom=windowTop+$(window).height(),windowSize=windowBottom-windowTop,setsInView=[],pageNum=false;$('.'+self.wrapperClass).each(function(){var id=$(this).attr('id'),setTop=$(this).offset().top,setHeight=$(this).outerHeight(false),setBottom=0,setPageNum=$(this).data('page-num');if(0==setHeight){$('> *',this).each(function(){setHeight+=$(this).outerHeight(false);});}
setBottom=setTop+setHeight;if(setTop<windowTop&&setBottom>windowBottom){setsInView.push({'id':id,'top':setTop,'bottom':setBottom,'pageNum':setPageNum});}
else if(setTop>windowTop&&setTop<windowBottom){setsInView.push({'id':id,'top':setTop,'bottom':setBottom,'pageNum':setPageNum});}
else if(setBottom>windowTop&&setBottom<windowBottom){setsInView.push({'id':id,'top':setTop,'bottom':setBottom,'pageNum':setPageNum});}});if(0==setsInView.length){pageNum=-1;}
else if(1==setsInView.length){var setData=setsInView.pop();if(((windowBottom-setData.top)/windowSize)<0.5)
pageNum=-1;else
pageNum=setData.pageNum;}
else{var majorityPercentageInView=0;$.each(setsInView,function(i,setData){var topInView=0,bottomInView=0,percentOfView=0;if(setData.top>windowTop&&setData.top<windowBottom)
topInView=(windowBottom-setData.top)/windowSize;if(setData.bottom>windowTop&&setData.bottom<windowBottom)
bottomInView=(setData.bottom-windowTop)/windowSize;if(topInView>=bottomInView)
percentOfView=topInView;else if(bottomInView>=topInView)
percentOfView=bottomInView;if(percentOfView>majorityPercentageInView){pageNum=setData.pageNum;majorityPercentageInView=percentOfView;}});}
if('number'==typeof pageNum){if(pageNum!=-1)
pageNum++;self.updateURL(pageNum);}}
Scroller.prototype.updateURL=function(page){var self=this,offset=self.offset>0?self.offset-1:0,pageSlug=-1==page?self.origURL:window.location.protocol+'//'+self.history.host+self.history.path.replace(/%d/,page+offset)+self.history.parameters;if(window.location.href!=pageSlug)
history.pushState(null,null,pageSlug);}
$(document).ready(function(){if('object'!=typeof infiniteScroll)
return;ajaxurl=infiniteScroll.settings.ajaxurl;stats=infiniteScroll.settings.stats;type=infiniteScroll.settings.type;text=infiniteScroll.settings.text;totop=infiniteScroll.settings.totop;infiniteScroll.scroller=new Scroller(infiniteScroll.settings);if(!isIE||(isIE&&IEVersion>=10)){$(window).bind('scroll',function(){clearTimeout(timer);timer=setTimeout(infiniteScroll.scroller.determineURL,100);});}});})(jQuery);