attribute vec4 a_position;

uniform mat4 u_matrix;

void main() {
    // 举证 * 位置 在三维中我们将提供x，y和z，然后将w设置为1, 而在属性中w的默认值就是1，我们可以利用这点不用再次设置。
  gl_Position = u_matrix * a_position;
}