/**
 * Note: Do not include any external libraries.
 * You may only use the drawing functions provided to complete this assignment.
 */

/**    HELPER FUNCTIONS     **/
/** Do not modify this code **/

/**
 * Draws a line segment on the screen connecting (x1, y1) and (x2, y2). This is the only function
 * you may call to draw.
 * @param  {DOMString} ctx - Canvas context to draw to. Simply pass in the given ctx variable
 * @param  {number} x1 - X coordinate of the start point
 * @param  {number} y1 - Y coordinate of the start point
 * @param  {number} x2 - X coordinate of the end point
 * @param  {number} y2 - Y coordinate of the end point
 * @param  {String} style - A string giving the colour of the line. Default is black.
 * @return {undefined}
 */
function drawLineSegment(ctx, x1, y1, x2, y2, style="black")
{
  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.strokeStyle = style;
  ctx.stroke();
}

/**
 * Takes a point defined as an array of numbers [x, y] and treats it as a homogeneous coordinate [x, y, 1]
 * The transformation T is a 2x3 matrix defined as an array of arrays
 * T = [[T11, T12, T13],
 *      [T21, T22, T23]]
 * The result is a new transformed point [x', y'] = T * [p[0], p[1], 1]
 * @param  {array} p - Point to transform
 * @param  {array} T - Transformation to apply
 * @return {array} New transformed point
 */
function transformPoint(p,T)
{
  var q = new Array();
  
  for(var i = 0; i<T.length; i++)
  {
    q[i] = 0;
    for(var j = 0; j<p.length; j++)
      q[i] += T[i][j] * p[j];
	// Translation
	q[i] += T[i][j];
  }
  
  return q;
}

/**
 * Given two transformations T1 and T2, returns a new transformation equivalent to applying
 * T1 followed by T2.
 * @param  {array} T1 - The first transform to apply
 * @param  {array} T2 - The second transfrom to apply
 * @return {array} A new transformation
 */
function composeTransforms(T1, T2) {
  var T_new = [
    [0, 0, 0],
    [0, 0, 0]
  ];

  for (var i = 0; i < 2; i++) {
    for (var j = 0; j < 3; j++) {
      for(var k = 0; k < 3; k++) {
        T_new[i][j] += T2[i][k] * (k === 2 ? (j === 2 ? 1 : 0) : T1[k][j]);
      }
    }
  }

  return T_new;
}
/** END OF HELPER FUNCTIONS **/


/**
 * This function should take a list of points and draw a closed polygon connecting the points.
 * Each point is an array containing two numbers [x, y].
 * @param  {DOMString} ctx - Canvas context to draw to. Simply pass in the given ctx variable
 * @param  {array} poly - Array of points corresponding to the vertices of the polygon [p1, p2, p3, ..., pn]
 * @return {undefined}
 */
function drawPolygon(ctx, poly)
{
  /** Fill in your answer here **/
  // Hint: call drawLineSegment to help you

  for (var i = 0; i < poly.length; i++){
    if (i == poly.length - 1){
      drawLineSegment(ctx, poly[i][0], poly[i][1], poly[0][0], poly[0][1]);
    }else{
      drawLineSegment(ctx, poly[i][0],poly[i][1],poly[i + 1][0],poly[i + 1][1]);
    }
  }

}

/**
 * Given an array of points defining a polygon, return a new array of points for a polygon transformed by
 * the transformation T.
 * @param  {array} poly - Array of points corresponding to the vertices of the polygon [p1, p2, p3, ..., pn]
 * @param  {array} T - T transformation to apply. Same definition as in transformPoint()
 * @return {array} Array of vertex locations for the transformed polygon
 */
function transformPolygon(poly, T)
{
  /** Fill in your answer here **/
  // Hint: call transformPoint to help you
  
  for (var i = 0; i < poly.length; i++) {
    new_point = transformPoint(poly[i], T);
    poly[i] = new_point;
  }

  return poly;
}

/**
 * Draws a circle of radius r around point [cx, cy].
 * @param  {DOMString} ctx - Canvas context to draw to. Simply pass in the given ctx variable
 * @param  {number} cx - X coordinate of the circle center
 * @param  {number} cy - Y coordinate of the circle center
 * @param  {number} r - Radius of the circle
 * @return {undefined}
 */
function drawCircle(ctx, cx, cy, r)
{
  /** Fill in your answer here **/
  // Hint: call drawLineSegment to help you

  for (var i = 0; i < 360; i+=30){
    theta1 = Math.PI * i / 180;
    theta2 = Math.PI * (i+30)/ 180;
    x1 = r * Math.cos(theta1) + cx;
    y1 = r * Math.sin(theta1) + cy;
    x2 = r * Math.cos(theta2) + cx;
    y2 = r * Math.sin(theta2) + cy;
    drawLineSegment(ctx, x1, y1, x2, y2);
  }
  
}

/**
 * Returns a transformation matrix T that defines a translation in homogeneous coordinates
 * by the vector offset [x, y].
 * That is, if applied to a point p = [p1, p2, 1] then it will be
 * translated to p' = [p1 + x, p2 + y, 1]
 * @param  {array} offset - The offset to translate by
 * @return {array} A 2x3 transformation matrix
 */
function translateByOffset(offset)
{
  var T = [
    [1, 0, 0],
    [0, 1, 0]
  ];

  /** Fill in your answer here **/
  
  T[0][2] += offset[0];
  T[1][2] += offset[1]; 
  
  return T;
}

/**
 * Returns a transformation matrix T that defines
 * a rotation by angle radians around a point joint.
 * @param  {number} angle - Angle in radians
 * @param  {array} joint - point [x, y] to rotate around 
 * @return {array} T - 2x3 transformation matrix defining the rotation
 */
function rotationAboutPoint(angle, joint)
{
  var T = [
    [1, 0, 0],
    [0, 1, 0]
  ];
  
  /** Fill in your answer here **/
  // Hint: Use Math.cos() and Math.sin()

  var inv_joint = [-joint[0],-joint[1]];
  
  R = T;
  T = translateByOffset(joint);
  R[0][0] = Math.cos(angle);
  R[0][1] = - Math.sin(angle);
  R[1][0] = Math.sin(angle);
  R[1][1] = Math.cos(angle);
  T_prime = translateByOffset(inv_joint);
  T1 = composeTransforms(T_prime,R);
  T = composeTransforms(T1,T);

  return T;
}


function drawPenguin(ctx)
{
  /** GET UI SLIDER VARIABLES **/
  /** You do not need to change this code **/
  var deg_to_rad = Math.PI / 180.0;
  var torso_x_offset = parseFloat(document.getElementById("slider_torso_x").value);
  var torso_y_offset = parseFloat(document.getElementById("slider_torso_y").value);
  var arm_angle = parseFloat(document.getElementById("slider_arm_angle").value) * deg_to_rad;
  var head_angle = parseFloat(document.getElementById("slider_head_angle").value) * deg_to_rad;
  var mouth_gap = parseFloat(document.getElementById("slider_mouth_gap").value);
  var hip_angles = [
    parseFloat(document.getElementById("slider_hip_angle0").value) * deg_to_rad,
    parseFloat(document.getElementById("slider_hip_angle1").value)  * deg_to_rad
  ];
  var ankle_angles = [
    parseFloat(document.getElementById("slider_ankle_angle0").value)  * deg_to_rad,
	parseFloat(document.getElementById("slider_ankle_angle1").value)  * deg_to_rad
  ];
  /** END OF GET UI SLIDER VARIABLES **/


  /** POLYGON DEFINITIONS **/
  /**
   * The polygons defining each body region are provided *relative to the origin*
   * It is your responsibility to transform and draw these polygons to construct a hierarchical model
   * that can be manipulated by the sliders. 
   *
   * You may not change these values manually.
   */
  // 
  var torso_poly = [[-56, -196], [-129, 99], [-46, 188], [36, 196], [129, 116], [69, -71], [36, -196]];
  var arm_poly = [[-38, -78], [-15, 78], [22, 78], [39, -74]];

  var head_poly = [[-19, -50], [-49, -29], [-62, 50], [62, 48], [46, -27]];
  var upper_beak_poly = [[41, -13], [-44, 2], [-41, 13], [43, 13]];
  var lower_beak_poly = [[-40, -3], [-42, 3], [41, 3], [41, -3]];
  
  var leg_poly = [[-15, -53], [-20, 52], [ 20,  52], [ 12, -53]];
  var foot_poly = [[54, -11], [58, 11], [-48,  11], [-58, -11]];
  
  // These will be drawn as circles
  var eye = [0, 0];
  var iris = [0, 0];
  
  // Radii of circles
  var eye_r = 10;
  var iris_r = 3;
  var arm_joint_r = 10;
  var head_joint_r = 5;
  var hip_joint_r = 5;
  var ankle_joint_r = 5;
  
  // Joint positions
  var hip_joints = [[0, 0], [0, 0]];
  var ankle_joints = [[0, 0], [0, 0]];
  var arm_joint = [0, 0];
  var head_joint = [0, 0];
  /** END OF POLYGON DEFINITIONS **/


  /*********************************/
  /** YOUR DRAWING CODE GOES HERE **/
  /*********************************/

  /** The torso and head are given as examples **/
  // Define the center of the torso in screen space
  // and a transformation to translate the torso to its origin
  var torso_origin = [360, 360];
  var torso_T = translateByOffset([torso_origin[0] + torso_x_offset, torso_origin[1] + torso_y_offset]);
  torso_poly = transformPolygon(torso_poly, torso_T);
  drawPolygon(ctx, torso_poly);

  // Define the transformation for the head as a rotation and then a translation
  var head_offset = [-10, -220]; // The location of the head relative to the body
  var head_joint_offset = [0, 35]; // The location of the head joint relative to the head center
  var head_T = composeTransforms(
    rotationAboutPoint(head_angle, head_joint_offset),
    translateByOffset(head_offset)
  );
 
  // Transform and draw the head in a hierarchical fashion
  // That is, if the body moves, then the head will move with it.
  head_poly = transformPolygon(head_poly, head_T);
  head_poly = transformPolygon(head_poly, torso_T);
  drawPolygon(ctx, head_poly);

  // Now draw the head joint
  head_joint = transformPoint(head_joint_offset, head_T);
  head_joint = transformPoint(head_joint, torso_T);
  drawCircle(ctx, head_joint[0], head_joint[1], head_joint_r);

  /* Draw the rest of the penguin below. */

  //Define the transformation for the upper beak just a translation
  var upper_beak_offset = [-100, -220];
  var upper_beak_rotation_offset = [90,35];
  var upper_beak_T = composeTransforms(
    rotationAboutPoint(head_angle, upper_beak_rotation_offset),
    translateByOffset(upper_beak_offset)
  );

  // Transform and draw the upper beak in a hierarchical fashion
  // That is, if the body moves, then the upper beak will move with it.
  upper_beak_poly = transformPolygon(upper_beak_poly, upper_beak_T);
  upper_beak_poly = transformPolygon(upper_beak_poly, torso_T);
  drawPolygon(ctx, upper_beak_poly);
  
  //Define the transformation for the eye as a rotation and then a translation
  var eye_offset = [-40,-235];
  var eye_rotation_offset = [30,50];
  var eye_T = composeTransforms(
    rotationAboutPoint(head_angle, eye_rotation_offset),
    translateByOffset(eye_offset)
  );

  // Now draw the eye joint
  eye = transformPoint(eye, eye_T);
  eye = transformPoint(eye, torso_T);
  drawCircle(ctx, eye[0], eye[1], eye_r);

  // Now draw the iris joint using eye_T, cuz move along eye
  iris = transformPoint(iris, eye_T);
  iris = transformPoint(iris, torso_T);
  drawCircle(ctx, iris[0], iris[1], iris_r);

  // Define the transformation for the lower beak as a rotation and 
  // then a translation adding lower beak's moving up and down
  var lower_beak_offset = [-100, -195];
  var lower_beak_rotation_offset = [90,10];
  var lower_beak_T = composeTransforms(
    rotationAboutPoint(head_angle, lower_beak_rotation_offset),
    translateByOffset([lower_beak_offset[0], lower_beak_offset[1] + mouth_gap])
  );

  // Transform and draw the lower beak in a hierarchical fashion
  // That is, if the body moves, then the lower beak will move with it.
  lower_beak_poly = transformPolygon(lower_beak_poly, lower_beak_T);
  lower_beak_poly = transformPolygon(lower_beak_poly, torso_T);
  drawPolygon(ctx, lower_beak_poly);

  //Define the transformation for the arm as a rotation and then a translation
  var arm_offset = [10, -35];
  var arm_joint_offset = [0,-60];
  var arm_T = composeTransforms(
    rotationAboutPoint(arm_angle, arm_joint_offset),
    translateByOffset(arm_offset)
  );

  // Transform and draw the arm in a hierarchical fashion
  // That is, if the body moves, then the arm will move with it.  
  arm_poly = transformPolygon(arm_poly, arm_T);
  arm_poly = transformPolygon(arm_poly, torso_T);
  drawPolygon(ctx, arm_poly);

  // Now draw the eye joint
  arm_joint = transformPoint(arm_joint_offset, arm_T);
  arm_joint = transformPoint(arm_joint, torso_T);
  drawCircle(ctx, arm_joint[0], arm_joint[1], arm_joint_r);

  // Clone leg poly
  another_leg = leg_poly.slice(0);

  // Define the transformation for the leg as a rotation and then a translation
  var leg_offset = [-65,190];
  var leg_joint_offset = [0,-40];
  var leg_T = composeTransforms(
    rotationAboutPoint(hip_angles[0], leg_joint_offset),
    translateByOffset(leg_offset)
  );

  // Transform and draw the leg in a hierarchical fashion
  // That is, if the body moves, then the leg will move with it. 
  leg_poly = transformPolygon(leg_poly, leg_T);
  leg_poly = transformPolygon(leg_poly, torso_T);
  drawPolygon(ctx, leg_poly);

  // Now draw the leg joint
  leg_joints = transformPoint(leg_joint_offset, leg_T);
  hip_joints[0] = transformPoint(leg_joints, torso_T);
  drawCircle(ctx, hip_joints[0][0], hip_joints[0][1], hip_joint_r);

  // Similar way as processing leg transformation
  var another_leg_offset = [65,190];
  var another_leg_T = composeTransforms(
    rotationAboutPoint(hip_angles[1], leg_joint_offset),
    translateByOffset(another_leg_offset)
  );

  another_leg = transformPolygon(another_leg, another_leg_T);
  another_leg = transformPolygon(another_leg, torso_T);
  drawPolygon(ctx, another_leg);

  another_leg_joints = transformPoint(leg_joint_offset, another_leg_T);
  hip_joints[1] = transformPoint(another_leg_joints, torso_T);
  drawCircle(ctx, hip_joints[1][0], hip_joints[1][1], hip_joint_r);

  // Clone foot poly
  another_foot = foot_poly.slice(0);

  // Define the transformation for the foot as a rotation relative to torso 
  // and a rotation relative to leg then a translation
  var foot_offset = [-110,230];
  var foot_joint_offset = [40,0];
  var foot_joint_leg_offset = [45,-80];
  var foot_T_1 = composeTransforms(
    rotationAboutPoint(ankle_angles[0], foot_joint_offset),
    rotationAboutPoint(hip_angles[0], foot_joint_leg_offset)
  );
  var foot_T_2 = composeTransforms(
    foot_T_1,
    translateByOffset(foot_offset)
  );

  // Transform and draw the foot in a hierarchical fashion
  // That is, if the body moves, then the foot will move with it. 
  foot_poly = transformPolygon(foot_poly, foot_T_2);
  foot_poly = transformPolygon(foot_poly, torso_T);
  drawPolygon(ctx, foot_poly);

  // Now draw the leg joint
  foot_joint = transformPoint(foot_joint_offset, foot_T_2);
  ankle_joints[0] = transformPoint(foot_joint, torso_T);
  drawCircle(ctx, ankle_joints[0][0], ankle_joints[0][1], ankle_joint_r);

  // Similar way as processing foot transformation
  var another_foot_offset = [20,230];
  var another_foot_T_1 = composeTransforms(
    rotationAboutPoint(ankle_angles[1], foot_joint_offset),
    rotationAboutPoint(hip_angles[1], foot_joint_leg_offset)
  );
  var another_foot_T_2 = composeTransforms(
    another_foot_T_1,
    translateByOffset(another_foot_offset)
  );

  another_foot = transformPolygon(another_foot, another_foot_T_2);
  another_foot = transformPolygon(another_foot, torso_T);
  drawPolygon(ctx, another_foot);

  another_foot_joint = transformPoint(foot_joint_offset, another_foot_T_2);
  ankle_joints[1] = transformPoint(another_foot_joint, torso_T);
  drawCircle(ctx, ankle_joints[1][0], ankle_joints[1][1], ankle_joint_r);

}


/**        BOILERPLATE DRAWING CODE        **/
/**   You do not need to modify this code  **/
function drawAxis(ctx)
{
  drawLineSegment(ctx, 0, 0, 100, 0, "red");
  drawLineSegment(ctx, 0, 0, 0, 100, "green");
  ctx.fillText("0,0", 4, 12);
  ctx.fillText("100,0", 98, 10);
  ctx.fillText("0,100", 5, 100);
}

// This function is called to draw the current frame. It is called whenever the
// sliders are changed.
function draw() 
{
  // you do not need to modify this function
  // this is help function
  // Boilerplate code to setup the canvas
  var canvas = document.getElementById('canvas');
  if (!canvas.getContext)
  {
    alert("Your browser is too old! Please upgrade to a canvas-capable browser.");
  }
  var ctx = canvas.getContext('2d');
  // clear canvas so we can draw a new frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // set global line width and smooth lines
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  // draw a small axis to demonstrate the inverted coordinate system
  drawAxis(ctx);
  // draw the current Penguin
  drawPenguin(ctx);
}
/**     END OF BOILERPLATE DRAWING CODE       **/
