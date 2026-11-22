import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hasSeenIntro, rememberIntro, shouldShowIntro, INTRO_STORAGE_KEY, INTRO_SEEN_VALUE } from '../src/config/intro.ts';
import { makeTicketGeometry, tearTarget, MAX_TEAR_ANGLE } from '../src/components/intro/ticketGeometry.ts';
test('Opening is limited to the first plain Home visit; deep links stay direct',()=>{
 assert.equal(shouldShowIntro('/','',false),true);
 assert.equal(shouldShowIntro('/','',true),false);
 for(const path of ['/product','/applications','/about'])assert.equal(shouldShowIntro(path,'',false,true),false);
 assert.equal(shouldShowIntro('/','#possibilities',false),false);
 assert.equal(shouldShowIntro('/','',true,true),true);
});
test('Completion is durable and unavailable storage does not throw',()=>{
 const map=new Map(),storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};
 assert.equal(hasSeenIntro(storage),false);rememberIntro(storage);
 assert.equal(map.get(INTRO_STORAGE_KEY),INTRO_SEEN_VALUE);assert.equal(hasSeenIntro(storage),true);
 const unavailable={getItem(){throw Error('denied');},setItem(){throw Error('denied');}};
 assert.equal(hasSeenIntro(unavailable),false);assert.doesNotThrow(()=>rememberIntro(unavailable));
});
test('Paper geometry preserves its horizontal and vertical seam coordinates',()=>{
 const horizontal=makeTicketGeometry(680,360,188,'horizontal');
 assert.equal(horizontal.mainWidth+horizontal.stubWidth,680);
 assert.deepEqual(horizontal.offset,{x:492,y:0});
 for(const bridge of horizontal.bridges){assert.equal(bridge.x,492);assert.ok(bridge.y>0&&bridge.y<360);}
 const vertical=makeTicketGeometry(340,458,116,'vertical');
 assert.equal(vertical.mainHeight+vertical.stubHeight,458);
 for(const bridge of vertical.bridges){assert.equal(bridge.y,342);assert.ok(bridge.x>0&&bridge.x<340);}
 assert.throws(()=>makeTicketGeometry(50,50,30,'horizontal'));
});
test('Outward tension tears naturally while stationary and inward pulls stay closed',()=>{
 const start={x:640,y:80},hinge={x:492,y:360};
 assert.equal(tearTarget(start,start,hinge,1,false,.15),0);
 assert.equal(tearTarget(start,{x:620,y:80},hinge,1,false,.15),0);
 assert.ok(tearTarget(start,{x:790,y:100},hinge,1,false,.15)>=MAX_TEAR_ANGLE);
 const small=tearTarget(start,{x:675,y:80},hinge,1,false,.15);
 const hard=tearTarget(start,{x:675,y:80},hinge,1,false,.8);
 assert.ok(small>hard&&small<MAX_TEAR_ANGLE);
});
