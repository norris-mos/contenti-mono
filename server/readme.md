The components only work in conjunction with a custom H5P server (e.g. one using @lumieducation/h5p-server) that provides endpoints that do these things:

1.get the required data about content (one for playing, one for editing)
2.save content created in the editor
3.serve all AJAX endpoints required by the H5P core
