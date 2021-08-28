import G from './G';

G.init();




// const fps = 6;
// const changeEvery = 1000 / fps;
// let elapsed = changeEvery;
// let index = 0; 

// const render = (dt : any) => {
//   elapsed += dt;
//   if (elapsed > changeEvery) {
//     elapsed = 0;
//     index = (index + 1) % 3;
    
//     console.log("Frame");
//   }  
// }


// let start : number | null;
// let loop = (timestamp : any) => {
//   if (!start) start = timestamp;
//   let dt = timestamp - start!;
//   start = timestamp;
//   render(dt);
  
//   requestAnimationFrame(loop);
// }

// requestAnimationFrame(loop);