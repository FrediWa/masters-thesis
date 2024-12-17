import sys
import re
import os


def extract_snippet(file_path):
    # Match Fortran !, Python # and C // comments with ---snippet-start and ---snippet-end.
    # \2 at the end making sure that the start and ends match
    pattern = r'(!|#|//)---snippet-start-([A-Z])\n(.*?)(!|#|//)---snippet-end-\2'

    snippets = [] 
    with open(file_path, 'r') as file:
        content = file.read()
        snippets = re.findall(pattern, content, re.DOTALL)

        # Snippet might not exist.
        if not snippets:
            return []
        
        # Fix capture groups.
        snippet_key_pairs = [(x[2], x[1]) for x in snippets]
        processed_snippets = []

        for snippet_key_pair in snippet_key_pairs:
            snippet = snippet_key_pair[0]
            key = snippet_key_pair[1]
            print("key", key)

            # De-indent lines as the snippet may be indented.
            indent_spaces = len(re.findall(r' +', snippet)[0])
            print(indent_spaces)
            pattern = r'^ {0,%d}' % indent_spaces
            snippet = re.sub(pattern, '', snippet, flags=re.MULTILINE)
            # snippet = snippet.strip()
            print(f"({snippet})")
            processed_snippets.append((snippet, key))


        return processed_snippets
    

def save_snippet_to_file(file_path, snippets):
    basename, ext = os.path.splitext(os.path.basename(file_path))
    output_dir = 'snippets'
    
    os.makedirs(output_dir, exist_ok=True)
    
    for snippet in snippets:  
        filename = f"{basename}-{snippet[1]}{ext}" 
        output_file_path = os.path.join(output_dir, filename)
    
        with open(output_file_path, 'w') as output_file:
            output_file.write(snippet[0])
    

file_path = sys.argv[1]
snippets = extract_snippet(file_path)
if snippets:
    save_snippet_to_file(file_path, snippets)
