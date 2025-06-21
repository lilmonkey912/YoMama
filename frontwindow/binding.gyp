{
  "targets": [
    {
      "target_name": "frontwindow",
      "sources": [ "frontwindow.c" ],
      "defines": [
        "NAPI_EXPERIMENTAL",
        "NODE_GYP_MODULE_NAME=frontwindow"
      ],
      "cflags!": [ "-fno-exceptions", "-std=c11" ],
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
