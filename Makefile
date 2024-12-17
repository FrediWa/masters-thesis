# Directory where the files are located
EXAMPLES_DIR = ./code/examples
PD_SOURCE_DIR = ./code/pitch-detector
SOURCE_DIRS = $(EXAMPLES_DIR) $(PD_SOURCE_DIR)
ALL_SOURCE_FILES = $(foreach dir,$(SOURCE_DIRS),$(shell find $(dir) -type f))

SNIPPET_GENERATOR_SCRIPT = ./generateSnippets.py

report: generate_snippets
	rm -rf build/*
	rm -f report.pdf
	pdflatex -output-directory=build report.tex
	bibtex build/report
	pdflatex -output-directory=build report.tex
	pdflatex -output-directory=build report.tex
	mv build/report.pdf report.pdf
	
generate_snippets: $(ALL_SOURCE_FILES)
	rm -rf snippets/*
	@for file in $(ALL_SOURCE_FILES); do \
		python $(SNIPPET_GENERATOR_SCRIPT) $$file; \
	done