{
  "targets": [
    {
      "target_name": "frontwindow",
      "sources": [ "frontwindow.c" ],
      "include_dirs": [
        "<!(node -p \"require('node-addon-api').include\")"
      ],
      "defines": [
        "NAPI_EXPERIMENTAL",
        "NODE_GYP_MODULE_NAME=frontwindow"
      ],
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
      "conditions": [
        [ 'OS=="win"', {
          "libraries": [],
          "msvs_settings": {
            "VCCLCompilerTool": {
              "ExceptionHandling": 0
            }
          }
        }]
      ]
    }
  ]
}
