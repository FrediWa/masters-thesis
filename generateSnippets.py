import sys
import re
import os


def extract_snippet(file_path):
    # Match Fortran !, Python # and C // comments with ---snippet-start and ---snippet-end.
    pattern = r'(!|#|//)---snippet-start(.*?)(!|#|//)---snippet-end'
    
    with open(file_path, 'r') as file:
        content = file.read()
        snippet = re.findall(pattern, content, re.DOTALL)

        # Snippet might not exist.
        if not snippet:
            return ""
        
        # Assume there is only one snippet.
        snippet = snippet[0][1]

        # De-indent lines as the snippet may be indented.
        indent_spaces = len(re.findall(r' +', snippet)[0])
        pattern = r'^ {0,%d}' % indent_spaces
        snippet = re.sub(pattern, '', snippet, flags=re.MULTILINE)

        return snippet.strip()
    

def save_snippet_to_file(file_path, snippet):
    filename = os.path.basename(file_path)  
    output_dir = 'snippets'
    
    os.makedirs(output_dir, exist_ok=True)
    
    output_file_path = os.path.join(output_dir, filename)
    
    with open(output_file_path, 'w') as output_file:
        output_file.write(snippet)
    

file_path = sys.argv[1]

snippet = extract_snippet(file_path)
if snippet.strip() != "":
    save_snippet_to_file(file_path, snippet)
