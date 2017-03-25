# Custom MIME Types plug-in

This plug-in allows the use of custom MIME Types in ICN based on file's extensions. It is especially useful when you want to use custom MIME Types in File Type Filters, that you are then re-using in Entry Templates associations. This plug-in will make ICN correctly resolve MIME Types for files based on their extensions, which will then be resolved to correct File Type Filters, which will lead to correct Entry Template being available in the drop-down list.
When used, it will also provide the correct MIME Type to the repository at add time, saving you the setup of the repository side (for instance editing mimetpes.properties to add your custom mapping in FileNet P8).
You can refer to the ***Demonstration*** section to get an overview of what it does.

## Getting started
### Prerequisites
* IBM Content Navigator 2.0.3.0 or later

### Installing the plug-in

1. Copy your plug-in in a location accessible by your ICN instance, or by all instances if you're using a clustered environment, or replicate it to all instances in the same location.
2. Access the ICN admin desktop, or the admin feature in a any desktop > _Plug-Ins_ and click _New Plug-In_.
3. Enter the full path of the plug-in's jar and click Load.
4. Set up the initial configuration to fit best you needs. See the configuration section for more details on all options.

### Add the action/feature
This plug-in does not have any action or feature. It is loaded by all clients (browsers) when connecting to ICN so no extra configuration, outside of the plug-in's configuration panel is required.
 
### Configuration

| Option        | Description | 
| - |:-:|
| MIME Types - file extensions mapping | Use this field to configure your custom MIME Types, the syntax is the following: ```mimetype:ext[,ext]*(;mimetype:ext[,ext]*)*```. |

#### Example:

For instance, to add two new MIME Types *application/dita+xml* and *application/ditamap+xml* with the respective extensions *.dita* and *.ditamap*, use the following:
```application/dita+xml:dita;application/ditamap+xml:ditamap```
Now let's say for some reason you also want *ditax* no be recognized as *application/dita+xml* (you will now get the two extensions *dita* and *ditax* mapped to *application/dita+xml*), use the following:
```application/dita+xml:dita,ditax;application/ditamap+xml:ditamap```

### Demonstration
#### Using this plug-in to correctly set the MIME Type in the target repository

[![basic-behavior](http://img.youtube.com/vi/yU8tNa5BVio/0.jpg)](https://youtu.be/yU8tNa5BVio)

#### Using this plug-in to recognize custom MIME Type in Entry Template Associations

[![entry-template-use](http://img.youtube.com/vi/_Zn8D_AflsE/0.jpg)](https://youtu.be/_Zn8D_AflsE)

### Known limitations

This plug-ins is fixing as much as it can on the client side, but there are some things that plug-ins cannot do, leading to one specific drawback:

#### Downloading when using *Name of the item in the repository*

When downloading documents in ICN, if you are in the specific case where:
 * You configured the repository to download using the name of the item instead of the file name
![download-option-item-name](https://github.com/ibm-ecm/icn-custom-mimetypes-plugin/readme/download-option.jpg "Use the name of the item in the repository option")
 * You are not including extensions in the name of the items

Then the ***.dat*** extension will be added to the item's name instead of the original extension.

ICN usually adds an extension to the item's name based on the MIME Type. The plug-in makes sure the MIME Type is correct in the repository, however the custom mappings are injected on the client side only (because of plug-ins limitations), and ICN won't be able to resolve a custom MIME Type it doesn't know on the server back to the original extension. To work around that, you should either use the option *Use the file name*, or keep the extension in the item's name.

Here is a video demonstrating the issue.
[![entry-template-use](http://img.youtube.com/vi/kFO1fIb0G8c/0.jpg)](https://youtu.be/kFO1fIb0G8c)

## Issues

If you find any issue in the plug-in, please open an Issue in this GitHub repository, we'll be happy to take a look at it as soon as we can. Please remember this is an Open Source project without official support so we can't commit to any deadline.
Feel free to submit a Pull Request yourself if you already fixed it, we'll be happy to accept it to share it with everyone else.

## Enhancements

You can also open enhancement requests, but as mentioned in the Issue section, this is an open source plug-in without official support so we can't commit to any deadline of any promises on implementing the requests.

## Contributors

### License

This plug-in is released under the [Apache 2](http://www.apache.org/licenses/LICENSE-2.0) license.

### How to configure

This plug-in is using Gradle as build automation system. Import, download, fork the project. Then you have two options to provide the two jars that are not part of the open-source release:

#### Copy them in the libs folder

Copy *j2ee.jar* and *navigator.jar* (renamed from *navigatorAPI.jar*) in the ***lib*** folder of the project and you are done. These jars can be found on any machine with ICN installed under **/opt/IBM/ECMClient/lib** for *navigatorAPI.jar* and **/opt/IBM/WebSphere/AppServer/lib** for *j2ee.jar* (if you're using WebSphere).

#### Use your own private Maven repository if you have one
If you own your own Maven repository where the two needed jars are needed, just comment the two following lines in build.gradle:
```
compile name: 'j2ee'
compile name: 'navigator'
```

And uncomment the two following lines. Edit them if you are using different groupId, artifactId or version.

```
// compile 'com.ibm.javax:j2ee:1.4.1'
// compile 'com.ibm.icn:navigatorAPI-plugin:2.0.3'
```

### How to compile

Simply run 
```
gradle assemble
```
in the project and you will get the final jar in ***build/dist*** folder.

### How to deploy the classes in ICN
If you're working on the plug-in, it is easier to use the classes directly in ICN instead of the building deploying the jar every time. Since the Gradle conventions dictate to split sources and resources, the default approach doesn't work. To work around that, we've changed the ***classes*** task of Gradle to compile and gather everything in a single folder under ***build/all***. So all you have to do is configure ICN as follow:
* Class file path: *$project_path*/build/all
* Class name: com.ibm.icn.extensions.custommimetype.CustomMIMETypePlugin

Then run ```gradle classes``` every time you want to push changes to your ICN instance. Of course you will still have to click the Load button if you changed the Java files, and refresh the page if you change the JavaScript files as you would normally do.

### Contribute

If you wish to contribute to this plug-in, the simplest way is to create Pull Requests and we will integrate them whenever it makes sense. If you want to become a long term contributor and have contributor access to the plug-in, you will have to contact us, and fill a Contributor License Agreement.






