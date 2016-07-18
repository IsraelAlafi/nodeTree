/**
 * Created by Israel Alafi on 04/03/2016.
 */

var tree = {};
tree.updateTree = true;

function init() {
    var self = this;
    $("#addNode").click(function(){
        var valid = true;
        var parent = $($(".form-control")[0]).val();
        var child = $($(".form-control")[1]).val();
        $(".form-control").removeClass('input-error');
        if (parent.trim()=='') {
            $($(".form-control")[0]).addClass('input-error').focus();
            valid = false;
        } else if ( child.trim()==''){
            $($(".form-control")[1]).addClass('input-error').focus();
            valid = false;
        } else {
            $(".form-control").val('');
        }


        if (valid) {
            if (typeof(tree.root) == 'undefined') {
                tree.root = new Node(parent, child);
            } else {
                tree = tree.root.addNewNode(tree.root, parent, child);
            }
            if (tree.updateTree) {
                $("#node-list").append('<li><strong>' + parent + ',' + child + '</strong></li>');
                var htmlTree = self.buildTreeView(tree.root, '', '');
                $(".tree-view").fadeOut(500, function () {
                    $(".tree-view ul").empty();
                    $(".tree-view").fadeIn();
                    $(".tree-view ul").append(htmlTree);
                });
            }
        }
    });

    $("input").keyup(function() {
        if($(this).val().length >= 1) {
            var input = $(this).closest('form').find(':input');
            input.eq(input.index(this) + 1).focus();
        }
    });
}

 function buildTreeView (root,htmlTree,htmlTreeTest) {
    var htmlTree = '<li><a href="#">'+ root.parent +'</a>';
    if ( root.children.length > 0 ){
        htmlTree+= '<ul>';
        for (var i = 0 ; i < root.children.length ; i++){
            htmlTree += buildTreeView (root.children[i]);
        }
        htmlTree+= '</ul>';
    }
     return htmlTree += '</li>'

}

function Node(parent,child){
    var self = this;
    this.parent = parent;
    this.children = [];

    if (typeof child == 'object'){
        this.children.push(child)
    }
    else if (child != null) {
        this.children.push(new Node(child));
    }
    this.hasChildNodes = function (){
        if (this.children.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    this.addNewNode = function (rootNode,parent,child) {
        var updateTree = false;
        var node = findNode (rootNode,parent);
        // if parent exist add child to child array
        if (node != null){
            node.children.push(new Node(child));
            updateTree = true;
        } else {
            // if the root parent of tree is the insertion child , the parent of child should be the parent of the tree
            if (rootNode.parent == child){
                rootNode = new Node(parent,rootNode);
                updateTree = true;
            } else {
                alert("Parent Not found in tree or parent already exist");
                updateTree = false;
            }
        }
        return {root:rootNode,updateTree:updateTree};
    }

    function findNode(rootNode,value){
        if (rootNode.parent == value){
            return rootNode;
        } else {
            if (rootNode.hasChildNodes()){
                for (var i =0 ; i < rootNode.children.length ; i++){
                   var node = findNode (rootNode.children[i],value);
                    if(node != null){
                        return node;
                    }
                }
            }
        }
        return null;
    }
}

