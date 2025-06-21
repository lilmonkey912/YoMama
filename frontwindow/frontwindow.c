// frontwindow.c
#include "js_native_api.h"
#include <stdlib.h>
#include <string.h>

#ifdef _WIN32
#include <windows.h>
#endif

#ifdef __APPLE__
const char *GetWindowTitleMac();
#endif

napi_value GetFrontWindowTitle(napi_env env, napi_callback_info info) {
#if defined(__APPLE__)
  const char *title = GetWindowTitleMac();
  napi_value out;
  napi_create_string_utf8(env, title, NAPI_AUTO_LENGTH, &out);
  free((void *)title);
  return out;
#else
  char result[512] = "<Unsupported platform>";

  HWND hwnd = GetForegroundWindow();
  if (hwnd) {
    if (GetWindowTextA(hwnd, result, sizeof(result)) > 0) {
      // ok
    } else {
      strcpy(result, "<No window>");
    }
  }

  napi_value out;
  napi_create_string_utf8(env, result, NAPI_AUTO_LENGTH, &out);
  return out;
#endif
}

napi_value Init(napi_env env, napi_value exports) {
  napi_value fn;
  napi_create_function(env, "getFrontWindowTitle", NAPI_AUTO_LENGTH, GetFrontWindowTitle, NULL, &fn);
  napi_set_named_property(env, exports, "getFrontWindowTitle", fn);
  return exports;
}

__attribute__((visibility("default")))
napi_value napi_register_module_v1(napi_env env, napi_value exports) {
  return Init(env, exports);
}
