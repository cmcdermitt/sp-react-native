#!/bin/bash

./gradlew ${1:-installDevMinSdkDevKernelDebug} --stacktrace && adb shell am start -n com.owlpath.owlpath/host.exp.exponent.MainActivity
