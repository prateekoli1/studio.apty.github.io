/* Custom Font Size TinyMCE v5 */
tinyMCE.PluginManager.add("custom-fontsize", function (editor, url) {
  const fontSizes = ["8pt", "10pt", "12pt", "14pt", "18pt", "24pt", "36pt"];
  const menuItems = [];
  tinyMCE.each(fontSizes, function (size) {
    menuItems.push({
      type: "menuitem",
      text: size,
      onAction: function (_) {
        editor.execCommand("fontSize", false, size);
      },
    });
  });
  editor.ui.registry.addMenuButton("custom-fontsize", {
    type: "menubutton",
    tooltip: "Font Size",
    icon: "resize",
    fetch: function (callback) {
      callback(menuItems);
    },
  });
});

/* Custom Font Alignment TinyMCE v5 */
tinyMCE.PluginManager.add("alignments", function (editor, url) {
  const alignmentMapperrs = [
    {
      type: "menuitem",
      icon: "align-left",
      execute: "JustifyLeft",
    },
    {
      type: "menuitem",
      icon: "align-right",
      execute: "JustifyRight",
    },
    {
      type: "menuitem",
      icon: "align-center",
      execute: "JustifyCenter",
    },
  ];
  const menuItems = [];
  tinyMCE.each(alignmentMapperrs, function (alignment) {
    menuItems.push({
      type: alignment.type,
      icon: alignment.icon,
      onAction: function (_) {
        tinyMCE.execCommand(alignment.execute);
      },
    });
  });
  editor.ui.registry.addMenuButton("alignments", {
    type: "menubutton",
    tooltip: "Text Alignment",
    icon: "align-justify",
    fetch: function (callback) {
      callback(menuItems);
    },
  });
});

/* Custom Font Family Plugin TinyMCE v5 */
tinyMCE.PluginManager.add("customfontselect", function (editor, url) {
  const fontsList = editor.getParam("custom_fonts");
  const menuItems = [];
  tinyMCE.each(fontsList, function (f) {
    menuItems.push({
      type: "menuitem",
      text: f.name,
      textStyle: "font-family: " + f.font,
      onAction: function (_) {
        editor.execCommand("fontName", false, f.font);
      },
    });
  });

  editor.ui.registry.addMenuButton("customfontselect", {
    type: "menubutton",
    icon: "format",
    tooltip: "Formats",
    fetch: function (callback) {
      callback(menuItems);
    },
  });
});

/**Custom Embed Content Plugin Tinymce v5 */
tinyMCE.PluginManager.add("embed-content", function (editor) {
  editor.ui.registry.addButton("embed-content", {
    icon: "sourcecode",
    onAction: function (_) {
      editor.execCommand("tinymcecustombutton");
    },
    onSetup: monitorNodeChange,
  });

  editor.addCommand("tinymcecustombutton", function (showUI, target) {
    var isUpdate = false;

    var snippet = "";
    var allowFullScreenMode = false;

    var node = target || tinyMCE.activeEditor.selection.getNode();

    //On open
    if (node.parentElement.className === "survey-code-snippet") {
      isUpdate = true;
      snippet = node.parentElement.firstChild.innerHTML;
      allowFullScreenMode = node.parentElement.firstChild.classList.contains(
        "allow-full-screen"
      );
    }

    // Open window
    editor.windowManager.open({
      title: "Embed Content",
      body: {
        type: "panel",
        items: [
          {
            type: "textarea",
            name: "snippet",
            value: snippet,
            multiline: true,
            classes: "snippet",
          },
          {
            type: "checkbox",
            name: "allowFullScreenMode",
            label: "Allow full screen mode",
            disabled: allowFullScreenMode,
          },
        ],
      },
      initialData: {
        allowFullScreenMode: allowFullScreenMode,
        snippet: snippet,
      },
      buttons: [
        {
          type: "cancel",
          name: "closeButton",
          text: "Cancel",
        },
        {
          type: "submit",
          name: "ok",
          text: "ok",
          primary: true,
        },
      ],
      onSubmit: function (e) {
        var data = e.getData();
        var htmlContent = [
          '<div class="survey-code-snippet-content' +
            (data.allowFullScreenMode ? " allow-full-screen" : "") +
            '">',
          data.snippet,
          "</div>",
          '<div style="display:none" class="survey-code-snippet-button">Embedded Code <button class="survey-code-remove-button">&#215;</button></div>',
        ].join("");

        if (isUpdate) {
          if (data.snippet) {
            node.parentElement.innerHTML = htmlContent;
          } else {
            node.parentElement.remove();
          }
        } else {
          if (!data.snippet) {
            return;
          }

          var html = [
            '<div class="survey-code-snippet" contenteditable="false">',
            htmlContent,
            "</div>",
          ].join("");

          var parentElement = node;
          var tagName;

          if (parentElement.tagName.toUpperCase() === "BODY") {
            parentElement = parentElement.lastElementChild;
          }

          while (parentElement.parentElement) {
            tagName = parentElement.parentElement.tagName.toUpperCase();
            if (tagName === "HTML") {
              throw new Error("Parent should not be HTML tag");
            }

            if (tagName == "BODY") {
              break;
            } else {
              parentElement = parentElement.parentElement;
            }
          }

          parentElement.after(createElementFromHTML(html));
        }
        editor.fire('codeEmbeded');
        e.close();
      },
    });
  });

  editor.on("DblClick", function (e) {
    if (e.target.className === "survey-code-snippet-button") {
      editor.execCommand("tinymcecustombutton", false, e.target);
    }
  });

  editor.on("Click", function (e) {
    if (e.target.className === "survey-code-remove-button") {
      e.target.parentElement.parentElement.remove();
    }
  });

  function createElementFromHTML(htmlString) {
    var div = document.createElement("div");
    div.innerHTML = htmlString.trim();
    return div.firstChild; // Change this to div.childNodes to support multiple top-level nodes
  }

  function monitorNodeChange(buttonApi) {}
});

/* Custom ListItemsStyle TinyMCE v5 */
tinyMCE.PluginManager.add("list-items-style", function (editor, url) {
  const listStyles = [
    {
      type: "menuitem",
      icon: "unordered-list",
      execute: "InsertUnorderedList",
    },
    {
      type: "menuitem",
      icon: "ordered-list",
      execute: "InsertOrderedList",
    }
  ];
  const menuItems = [];
  tinyMCE.each(listStyles, function (style) {
    menuItems.push({
      type: style.type,
      icon: style.icon,
      onAction: function (_) {
        tinyMCE.execCommand(style.execute, false);
      },
    });
  });
  editor.ui.registry.addMenuButton("list-items-style", {
    tooltip: "Lists",
    icon: "unordered-list",
    fetch: function (callback) {
      callback(menuItems);
    },
  });
});
