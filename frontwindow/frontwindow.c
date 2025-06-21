#include <stdlib.h>
#include <string.h>

#ifdef _WIN32
#include <windows.h>
#else
#include <dlfcn.h>
#endif

#ifdef __APPLE__
const char *GetWindowTitleMac();
#endif

void *self_dl;

typedef void *napi_env;
typedef void *napi_value;
typedef void *napi_callback;
typedef void *napi_status;
typedef void *napi_callback_info;

napi_status (*fn_napi_create_string_utf8)(napi_env env, const char *str, size_t length, napi_value *result);
napi_status (*fn_napi_create_function)(napi_env env,
                                                        const char *utf8name,
                                                        size_t length,
                                                        napi_callback cb,
                                                        void *data,
                                                        napi_value *result);
napi_status (*fn_napi_set_named_property)(napi_env env,
                                                           napi_value object,
                                                           const char *utf8name,
                                                           napi_value value);

napi_value GetFrontWindowTitle(napi_env env, napi_callback_info info) {
#if defined(__APPLE__)
  const char *title = GetWindowTitleMac();
  napi_value out;
  fn_napi_create_string_utf8(env, title, strlen(title), &out);
  free((void *)title);
  return out;
#elif defined(_WIN32)
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
  fn_napi_create_string_utf8(env, result, strlen(result), &out);
  return out;
#else
  napi_value out;
  fn_napi_create_string_utf8(env, "<Unsupported platform>", strlen("<Unsupported platform>"), &out);
  return out;
#endif
}

napi_value Init(napi_env env, napi_value exports) {
  napi_value fn = NULL;
  fn_napi_create_function(env, "getFrontWindowTitle", strlen("getFrontWindowTitle"), GetFrontWindowTitle, NULL, &fn);
  fn_napi_set_named_property(env, exports, "getFrontWindowTitle", fn);
  return exports;
}

__attribute__((visibility("default")))
napi_value napi_register_module_v1(napi_env env, napi_value exports) {
#ifdef _WIN32
  self_dl = GetModuleHandle(NULL);
  fn_napi_create_string_utf8 = (void *)GetProcAddress(self_dl, "napi_create_string_utf8");
  fn_napi_create_function = (void *)GetProcAddress(self_dl, "napi_create_function");
  fn_napi_set_named_property = (void *)GetProcAddress(self_dl, "napi_set_named_property");
#else
  self_dl = dlopen(NULL, RTLD_NOW);
  fn_napi_create_string_utf8 = dlsym(self_dl, "napi_create_string_utf8");
  fn_napi_create_function = dlsym(self_dl, "napi_create_function");
  fn_napi_set_named_property = dlsym(self_dl, "napi_set_named_property");
#endif

  return Init(env, exports);
}
