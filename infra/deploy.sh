rsync -avz \
  -e "ssh -p 22 -o StrictHostKeyChecking=no" \
  admin.dpn-pppi.org/ root@168.231.118.186:/www/wwwroot/admin.dpn-pppi.org