# Directory where the files are located
SOURCE_DIR = ./code/examples
SNIPPET_GENERATOR_SCRIPT = ./generateSnippets.py

report: generate_snippets
	rm -rf build/*
	rm -f report.pdf
	pdflatex -output-directory=build report.tex
	bibtex build/report
	pdflatex -output-directory=build report.tex
	pdflatex -output-directory=build report.tex
	mv build/report.pdf report.pdf
	
generate_snippets: $(SOURCE_DIR)/*.*
	for file in $(SOURCE_DIR)/*.*; do \
		python $(SNIPPET_GENERATOR_SCRIPT) $$file; \
	done