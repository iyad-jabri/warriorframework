var wdf = {
    search_and_hide: function(){
        $systems = $(".control-box");
        console.log($systems);
        $.each($systems, function(ind, sys) {
            if (! $(sys).attr("id").startsWith("template")) {
                $sys = $(sys);
                $subsystem_id = $sys.attr("id").split("-").slice(1,2);
                // if it has tags
                if ($sys.find("#content").length > 0 && $subsystem_id != "1") {
                    $sys.find("[katana-click='wdf.addSubSystem']").hide();
                }
            }
        });
    },

    toggle: function(){
        // hide all the div with id content under control-box
        $target = $(this).closest(".control-box");
        $target.children("#content").toggle();
        $target.children("#subcontent").toggle();
    },

    deleteTag: function(){
        // empty tag and all of its child tags
        $target = $(this).closest(".control-box");

        // When delete the last tag, shows addSubSystem icon
        if ($target.find("#content:has(div)").length == 1) {
            $target.find("[katana-click='wdf.addSubSystem']").show();
        }

        $target = $(this).parent().parent();
        $raw_id = $target.find("[name*='-key']").attr("name").substring(0, $target.find("[name*='-key']").attr("name").length-4);
        $id = $raw_id.split("-").slice(0,-1).join("-");

        // loop through all child tag and empty them
        $children = $target.parent().find("[name*='"+$id+"-']");
        for (var i=0; i<$children.length; i++) {
            if ($($children.get(i)).prop("name").indexOf("key") !== -1) {
                $child = $($children.get(i)).parent().parent();
                // $child.removeClass("animated fadeIn");
                // $child.addClass("animated bounceOutLeft");
                // closure
                // setTimeout((function(tmp){return function(){tmp.empty();}})($child), 600);
                $child.empty();
            }
        }
  
        // $target.removeClass("animated fadeIn");
        // $target.addClass("animated bounceOutLeft");
        // setTimeout(function(){$target.empty();}, 600);
        $target.empty();
    },

    deleteChildTag: function(){
        // hide a specific child tag
        $target = $(this).parent().parent().find("[name*='key']");
        $hide_target = $target.parent().parent();
        if ($target.prop("name").indexOf("deleted") == -1) {
            $target.prop("name", "deleted-"+$target.prop("name"));
            // $hide_target.removeClass("animated fadeIn");
            // $hide_target.addClass("animated bounceOutLeft");
            // setTimeout(function(){$hide_target.parent().parent().hide()}, 600);
            $hide_target.hide();
        }
    },

    deleteSystem: function(){
        // empty the whole system
        $target=$(this).closest(".control-box");

        // When delete the 2nd last system, show add tag icon on main system
        var $system_id = $target.attr("id").split("-").slice(0,1);
        var $subsystem_id = $target.attr("id").split("-").slice(1,2);
        if ($target.parent().find("[id^='"+$system_id+"-']:not(:empty)").length == 2) {
            // alert("You delete the last subsystem");
            $target.parent().find("[id^='"+$system_id+"-1-']").find("[katana-click='wdf.addTag']").show()
        }
        // $target.removeClass("animated fadeIn");
        // $target.addClass("animated bounceOutLeft");
        // setTimeout(function(){$target.empty()}, 600);
        $target.empty();
    },

    addSystem: function(){
        // Add a system
        var $tmp = katana.$activeTab.find("#system_template").clone();
        $tmp.find("#template-system").prop("id", katana.$activeTab.find(".control-box").length-1+"-1-control-box")
        $tmp.find("[name='template-system-name']").prop("name", katana.$activeTab.find(".control-box").length-1+"-1-system_name");
        $tmp.find("[name='template-system.tag']").prop("name", katana.$activeTab.find(".control-box").length-1+"-1-1-1-key");
        $tmp.find("[name='template-system.value']").prop("name", katana.$activeTab.find(".control-box").length-1+"-1-1-1-value");
        katana.$activeTab.find("#big-box").append($($tmp.html()));
    },

    addTag: function(){
        var $tmp = katana.$activeTab.find("#tag_template").clone();
        // go to control box level
        var $target = $(this).closest(".control-box");
        var $system_id = $target.attr("id").split("-").slice(0,1);
        var $subsystem_id = $target.attr("id").split("-").slice(1,2);
        if ($target.parent().find("[id^='"+$system_id+"-']").length > 1 && $subsystem_id == "1") {
            alert("Please only add tag in subsystem");
        } else {
            var $id = $target.attr("id").substring(0, $target.attr("id").length-11);
            $tmp.find("[name='template-tag.tag']").prop("name", $id+($target.children("#content").length+1)+"-1-key");
            $tmp.find("[name='template-tag.value']").prop("name", $id+($target.children("#content").length+1)+"-1-value");
            $target.append($($tmp.html()));
        }
        $target.find("[katana-click='wdf.addSubSystem']").hide();
    },

    addChild: function(){
        var $tmp = katana.$activeTab.find("#child_tag_template").clone();
        // go to control box level
        var $target = $(this).closest("#content");
        var $raw_id = $target.find("[name*='-key']").attr("name").substring(0, $target.find("[name*='-key']").attr("name").length-4);
        var $id = $raw_id.split("-").slice(0,-1).join("-");
        var $new_id = $target.parent().find("[name*='"+$id+"']").length/2+1;
        $tmp.find("[name='template-tag.tag']").prop("name", $id+"-"+$new_id+"-key");
        $tmp.find("[name='template-tag.value']").prop("name", $id+"-"+$new_id+"-value");
        $target.parent().find("[name*='"+$id+"']:last").parent().parent().after($($tmp.html()));
    },

    addSubSystem: function(){
        var $target = $(this).closest(".control-box");
        var $system_id = $target.attr("id").split("-").slice(0,1);
        var $subsystem_id = $target.attr("id").split("-").slice(1,2);
        if ($subsystem_id != "1") {
            alert("Please only add subsystem under top level system");
        } else if ($subsystem_id == "1" && $target.find("#content:has(div)").length > 0){
            alert("Please only add subsystem when top level system doesn't have tag");
        } else {
            var $tmp = katana.$activeTab.find("#subsystem_template").clone();
            var $system_id = $target.attr("id").split("-")[0];
            var $subsystem_count = $target.parent().find("[id^='"+$system_id+"-']").length;
            $tmp.find("#template-subsystem").prop("id", $system_id+"-"+($subsystem_count+1)+"-control-box");
            $tmp.find("[name='template-system-name']").attr("value", $target.find('[name*="system_name"]').attr("value"));
            $tmp.find("[name='template-system-name']").prop("name", $system_id+"-"+($subsystem_count+1)+"-system_name");
            $tmp.find("[name='template-subsystem-name']").prop("name", $system_id+"-"+($subsystem_count+1)+"-subsystem_name");
            $tmp.find("[name='template-subsystem.tag']").prop("name", $system_id+"-"+($subsystem_count+1)+"-"+($target.children("#content").length+1)+"-1-key");
            $tmp.find("[name='template-subsystem.value']").prop("name", $system_id+"-"+($subsystem_count+1)+"-"+($target.children("#content").length+1)+"-1-value");
            $target.after($($tmp.html()));

            $target.parent().find("[id^='"+$system_id+"-1']").find("[katana-click='wdf.addTag']").hide()
        }
    },

    hide: function(){
        $(this).hide();
    },

    newFile: function(){
        // send a get request to request a empty page
        $.ajax({
            url: "wdf/index",
            type: "GET",
            success: function(data){
                // console.log(data);
                katana.$activeTab.find("#main_info").replaceWith(data);
                katana.refreshAutoInit(katana.$activeTab.find("#system_template"));
                katana.refreshAutoInit(katana.$activeTab.find("#tag_template"));
                katana.refreshAutoInit(katana.$activeTab.find("#child_tag_template"));
                katana.refreshAutoInit(katana.$activeTab.find("#subsystem_template"));
                // console.log("loaded");
            }
        });
    },

    build_tree: function(){
        // get the file system tree from jstree library
        $.ajax({
            url: "wdf/gettree",
            type: "GET",
            dataType: "json",
            success: function(data){
                katana.$activeTab.find("#jstree").jstree({'core':{'data':[data]}});
            }
        });

        // change the tree with actual editor page
        katana.$activeTab.find('#jstree').on("select_node.jstree", function (e, data) {
            // console.log("select_node");
            // console.log(data);
            if (data["node"]["icon"] == "jstree-file") {
                // console.log(data["node"]["li_attr"]["data-path"]);
                var csrftoken = katana.$activeTab.find("[name='csrfmiddlewaretoken']").val();
                $.ajax({
                    url: "wdf/index",
                    type: "POST",
                    headers: {'X-CSRFToken':csrftoken},
                    data: {"path": data["node"]["li_attr"]["data-path"]},
                    success: function(data){
                        // console.log(data);
                        katana.$activeTab.find("#main_info").replaceWith(data);
                        katana.refreshAutoInit(katana.$activeTab.find("#system_template"));
                        katana.refreshAutoInit(katana.$activeTab.find("#tag_template"));
                        katana.refreshAutoInit(katana.$activeTab.find("#child_tag_template"));
                        katana.refreshAutoInit(katana.$activeTab.find("#subsystem_template"));
                        wdf.search_and_hide();
                        // console.log("loaded");
                    }
                });
              // katana.templateAPI.post("wdf/index", csrftoken, {"path": data["node"]["li_attr"]["data-path"]});
            }
        });
    },

    submit: function(){
        // save all the input fields and post it to server
        var csrftoken = $("[name='csrfmiddlewaretoken']").val();

        $.ajax({
            url : "/katana/wdf/post",
            type: "POST",
            data : katana.$activeTab.find("#big-box").serializeArray(),
            headers: {'X-CSRFToken':csrftoken},
            //contentType: 'application/json',
            success: function(data){
                // load the tree
                katana.$activeTab.find("#main_info").replaceWith(data);
                katana.refreshAutoInit(katana.$activeTab.find("#jstree"));
            }
        }); 
    },

    cancel: function(){
        // save all the input fields and post it to server

        $.ajax({
            url : "/katana/wdf/",
            type: "GET",
            //contentType: 'application/json',
            success: function(data){
                // load the tree
                katana.$activeTab.find("#main_info").replaceWith(data);
                katana.refreshAutoInit(katana.$activeTab.find("#jstree"));
            }
        }); 
    },
}