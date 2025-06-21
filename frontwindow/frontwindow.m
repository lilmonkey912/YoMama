#import <AppKit/AppKit.h>
#import <ApplicationServices/ApplicationServices.h>

const char *GetWindowTitleMac() {
    NSRunningApplication *app = [[NSWorkspace sharedWorkspace] frontmostApplication];
    if (!app) return "<No App>";

    AXUIElementRef appRef = AXUIElementCreateApplication(app.processIdentifier);
    CFArrayRef windows = nil;
    AXUIElementCopyAttributeValue(appRef, kAXWindowsAttribute, (CFTypeRef*)&windows);

    if (!windows || CFArrayGetCount(windows) == 0) {
        if (windows) CFRelease(windows);
        CFRelease(appRef);
        NSString *appName = app.localizedName;
        size_t length = [appName maximumLengthOfBytesUsingEncoding:NSUTF8StringEncoding];
        char *cstr = (char *)malloc(length + 1);
        [appName getCString:cstr maxLength:length + 1 encoding:NSUTF8StringEncoding];
        return cstr;
    }

    AXUIElementRef window = (AXUIElementRef)CFArrayGetValueAtIndex(windows, 0);
    CFStringRef title = NULL;
    AXUIElementCopyAttributeValue(window, kAXTitleAttribute, (CFTypeRef*)&title);

    NSString *result = title ? (__bridge NSString *)title : app.localizedName;
    CFRelease(windows);
    CFRelease(appRef);

    if (result.length == 0) {
        result = app.localizedName;
    } else {
        result = [NSString stringWithFormat:@"%@ - %@", app.localizedName, result];
    }

    size_t length = [result maximumLengthOfBytesUsingEncoding:NSUTF8StringEncoding];
    char *cstr = (char *)malloc(length + 1);
    [result getCString:cstr maxLength:length + 1 encoding:NSUTF8StringEncoding];
    
    return cstr;
}
