#!/bin/bash
set -e

# Run the python script to generate the LaTeX source
echo "Generating LaTeX file..."
python3 scripts/generate_handout.py

# Compile using xelatex
echo "Compiling biology_handout.tex using xelatex (Pass 1)..."
xelatex -interaction=nonstopmode biology_handout.tex

echo "Compiling biology_handout.tex using xelatex (Pass 2)..."
xelatex -interaction=nonstopmode biology_handout.tex

echo "Compilation successful! biology_handout.pdf has been created."
