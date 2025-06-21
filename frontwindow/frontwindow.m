#import <AppKit/AppKit.h>
#import <ApplicationServices/ApplicationServices.h>

const char *GetWindowTitleMac() {
    NSRunningApplication *app = [[NSWorkspace sharedWorkspace] frontmostApplication];
    if (!app) return "";

    AXUIElementRef appRef = AXUIElementCreateApplication(app.processIdentifier);
    CFArrayRef windows = nil;
    AXUIElementCopyAttributeValue(appRef, kAXWindowsAttribute, (CFTypeRef*)&windows);
    if (!windows || CFArrayGetCount(windows) == 0) {
        if (windows) CFRelease(windows);
        CFRelease(appRef);
        return "";
    }

    AXUIElementRef window = (AXUIElementRef)CFArrayGetValueAtIndex(windows, 0);
    CFStringRef title = NULL;
    AXUIElementCopyAttributeValue(window, kAXTitleAttribute, (CFTypeRef*)&title);

    NSString *result = title ? (__bridge NSString *)title : @"";
    CFRelease(windows);
    CFRelease(appRef);
    
    char *cstr = (char *)malloc(result.length + 1);
    [result getCString:cstr maxLength:result.length + 1 encoding:NSUTF8StringEncoding];
    return cstr;
}
