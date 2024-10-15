report:
	rm -rf build/*
	rm -f report.pdf
	pdflatex -output-directory=build report.tex
	bibtex build/report
	pdflatex -output-directory=build report.tex
	pdflatex -output-directory=build report.tex
	mv build/report.pdf report.pdf
	