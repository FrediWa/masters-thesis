# Pitch detection using FFT
Masters thesis in Computer Engineering by Fredrik Wasström
## Abstract
abstract goes here1§
## Dependencies and running
The release should be kept up to date but the report can be built by running `make`. Python, pdflatex and the `IEEEtran`package are required for running` 

## Automatic code snippets
I'm too proud not to mention this little helping feature I created. In the thesis, I only want to include snippets but to verify that they work, I need a bunch of other stuff in the code. Initially, I copy pasted the snippets I wanted but then I started to feel like I need to be able to automatically create the snippets directly from working code. Inspired by how Vaadin tags their snippets for documentation, I defined snippet markers `---snippet-start`and `---snippet-end` and had a Python script search a file for these markers and copy the content in between to another file. Make is responsible for finding the changed file(s) and giving it to Python.