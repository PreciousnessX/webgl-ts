precision mediump float; // precision是用来指定数值的精确度的关键字，紧接着跟在precision后面的是精确度修饰符

varying vec4 v_color;

void main() {
  gl_FragColor = v_color;
}