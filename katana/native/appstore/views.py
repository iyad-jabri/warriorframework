"""
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

"""

from __future__ import unicode_literals

from os import getcwd
from django.shortcuts import render
from django.views import View

from native.appstore.appstore_utils.installer import Installer
from native.appstore.appstore_utils.uninstaller import Uninstaller
from utils.directory_traversal_utils import get_parent_directory
from wui.core.core_utils.app_info_class import AppInformation


class AppStoreView(View):

    template = 'appstore/appstore.html'

    def get(self, request):
        """
        Get Request Method
        """
        return render(request, AppStoreView.template, {"data": AppInformation.information.apps})


def uninstall_an_app(request):
    app_path = request.POST.get("app_path", None)
    app_type = request.POST.get("app_type", None)
    uninstaller_obj = Uninstaller(get_parent_directory(getcwd()), app_path, app_type)
    output = uninstaller_obj.uninstall()
    return render(request, AppStoreView.template, {"data": AppInformation.information.apps})


def install_an_app(request):
    app_path = request.POST.get("app_path", None)
    installer_obj = Installer(get_parent_directory(getcwd()), app_path)
    installer_obj.install()
    return render(request, AppStoreView.template, {"data": AppInformation.information.apps})
