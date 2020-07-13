import os
import json
import pandas as pd
from pdb import set_trace as bp

data_path = '../to_upload/20200707'
dest_path = '../to_upload/20200707.csv'
list_of_ids = os.listdir(data_path)
df = pd.DataFrame()
ids = []
for x in list_of_ids:
    with open(os.path.join(data_path,x,"metadata.json")) as f:
        metadata = json.load(f)
        ids.append(x)
        metadata_pd = [metadata]
        df_meta = pd.DataFrame(metadata_pd)
        df = df.append(df_meta,ignore_index=True,sort=False)
df.insert(0,'id',ids)
df.to_csv(dest_path,index=False)
