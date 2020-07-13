import os
import json
import pandas as pd
from pdb import set_trace as bp

annotated_data_path = '/Users/prashant/Downloads/Coswara/to_upload/Annotated'
dest_path = '/Users/prashant/Downloads/Coswara/to_upload/Annotated_ans.csv'
folders = os.listdir(annotated_data_path)
df = pd.DataFrame()
ids_in_csv = []
recs = []
c = 0
folders.remove('.git')
for x in folders:
    ids = os.listdir(os.path.join(annotated_data_path,x))
    for y in ids:
        jsons = os.listdir(os.path.join(annotated_data_path,x,y))
        for rec in jsons:
            row = [json.load(open(os.path.join(annotated_data_path,x,y,rec), 'r'))]
            # row['ID'] = y
            # row['Recording'] = os.path.splitext(rec)[0]
            # df_row = [row]
            ids_in_csv.append(y)
            recs.append(os.path.splitext(rec)[0])
            df_row = pd.DataFrame(row)
            df = df.append(df_row,ignore_index=True,sort=False)
            c+=1
        # print("{} done ".format(y))
    print("Folder {} done".format(x))

bp()
df.insert(0,'id',ids_in_csv)
df.insert(1,'recording',recs)
print("Count : ",c)
df.to_csv(dest_path,index=False)