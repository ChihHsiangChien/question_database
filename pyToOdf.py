from odf.opendocument import OpenDocumentText
from odf.style import Style, TextProperties
from odf.text import H, P, Span

textdoc = OpenDocumentText()
# Styles
s = textdoc.styles
h1style = Style(name="Heading 1", family="paragraph")
h1style.addElement(TextProperties(attributes={'fontsize':"24pt",'fontweight':"bold" }))
s.addElement(h1style)
# An automatic style
boldstyle = Style(name="Bold", family="text")
boldprop = TextProperties(fontweight="bold")
boldstyle.addElement(boldprop)
textdoc.automaticstyles.addElement(boldstyle)
# Text
h=H(outlinelevel=1, stylename=h1style, text="My first text")
textdoc.text.addElement(h)
p = P(text="Hello world. ")
boldpart = Span(stylename=boldstyle, text="This part is bold. ")
p.addElement(boldpart)
p.addText("This is after bold.")
textdoc.text.addElement(p)
textdoc.save("myfirstdocument.odt")