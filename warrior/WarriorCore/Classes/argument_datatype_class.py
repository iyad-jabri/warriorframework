'''
Copyright 2017, Fujitsu Network Communications, Inc.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
'''

"""This is argument datatype class api that converts the user input
arguments in Warrior testcase xml into python datatypes"""


import ast
import traceback
from Framework.Utils.print_Utils import print_error, print_info

class ArgumentDatatype(object):
    """This is the class that gets the data type of an argument
    supplied by the user and stores it in the data repository """

    def __init__(self, arg_name, arg_value):
        """Constructor that gets the arg_name and arg_value """
        self.arg_name = arg_name
        self.arg_value = arg_value
        self.datatype = None

    def convert_arg_to_datatype(self):
        """Parses the input argument to find the data type requested by the user

        This is based on the starting letters of the argument name
        If arg_name starts with:
        1. str_ = string
        2. int_ = integer
        3. float_ = float
        4. bool_ = boolean
        5. list_ = list
        6. tuple_ = tuple
        7. dict_ = dict
        8. file_ = file

        Default: if none of the above naming convention matches then the argument value
        will be treated as a string
        """
        self.datatype = None
        if self.arg_name.startswith('str_'):
            return self.arg_value
        elif self.arg_name.startswith('int_'):
            self.datatype = int
        elif self.arg_name.startswith('float_'):
            self.datatype = float
        elif self.arg_name.startswith('bool_'):
            self.datatype = bool
            if self.arg_value.lower() == "true":
                self.arg_value = "True"
            elif self.arg_value.lower() == "false":
                self.arg_value = "False"
        elif self.arg_name.startswith('list_'):
            self.datatype = list
        elif self.arg_name.startswith('tuple_'):
            self.datatype = tuple
        elif self.arg_name.startswith('dict_'):
            self.datatype = dict
        elif self.arg_name.startswith('file_'):
            self.datatype = file
            try:
                self.arg_value = file(self.arg_value)
            except IOError:
                pass

        else:
            print_info("User has not specified any data type, input argument "
                       "will be treated as string (default)")
            return self.arg_value
        if self.datatype is not None:
            convert_msg = "Input argument {0} will be converted to a {1}".format(self.arg_name, self.datatype)
            print_info(convert_msg)

        result = self.convert_string_to_datatype()
        return result

    def convert_string_to_datatype(self):
        """Converts an input string to a python datatype """

        err_msg = ("User input argument value '{0}' does not match python "
                   "syntax for '{1}'").format(self.arg_value, self.datatype)
        info_msg = "Warrior FW will handle user input argument value as string (default)"
        try:
            result = ast.literal_eval(self.arg_value) if self.datatype is not file else self.arg_value
        except Exception:
            print '\n'
            print_error(err_msg)
            print_info(info_msg)
            print '\n'
            print_error('unexpected error: {0}'.format(traceback.format_exc()))
            result = self.arg_value
        else:
            if not isinstance(result, self.datatype):
                print '\n'
                print_error(err_msg)
                print_info(info_msg)
                print '\n'
                result = self.arg_value

        return result
