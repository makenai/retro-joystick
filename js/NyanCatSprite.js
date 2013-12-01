// slyke whatevs here
function NyanCatSprite() {
  var nyanCat = document.createElement('div');
  nyanCat.setAttribute('id', 'nyanCat');
  nyanCat.innerHTML = '<div id="nyanCat"> <div id="wholeHead"> <div class="skin ear"></div> <div class="skin ear rightEar"></div> <div id="mainHead" class="skin"> <div class="eye"></div> <div class="eye rightEye"></div> <div class="nose"></div> <div class="chick"></div> <div class="chick rightChick"></div> <div class="mouth">E</div> </div> </div> <div id="toastBody"> <div> &nbsp;  &nbsp; &nbsp;.&nbsp;&nbsp;.&nbsp; &nbsp; &nbsp;..&nbsp;  &nbsp; &nbsp;.&nbsp;.&nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;..&nbsp;  &nbsp; &nbsp;.&nbsp;&nbsp;.  </div> </div> <div id="wholeTail"> <div class="tail skin"></div> <div class="tail middleTail skin"></div> <div class="tail backTail skin"></div> </div> <div id="allYourLegAreBelongToUs"> <div class="skin leg back leftBack"></div> <div class="skin leg back"></div> <div class="skin leg front leftFront"></div> <div class="skin leg front"></div> </div> <div class="rainbow"></div> <div class="rainbow r2"></div> <div class="rainbow r3"></div> <div class="rainbow r4"></div> </div>';
  document.body.appendChild(nyanCat);
  return $(nyanCat);
}
