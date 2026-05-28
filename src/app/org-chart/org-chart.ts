import { Component, OnInit } from '@angular/core';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { TreeNode } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { TreeModule } from 'primeng/tree'; // Thêm thành phần Cây danh sách
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-org-chart',
  imports: [OrganizationChartModule, FormsModule, TreeModule, ButtonModule, DrawerModule, InputTextModule],
  templateUrl: './org-chart.html',
  standalone: true,
  styleUrl: './org-chart.css',
})

export class OrgChart implements OnInit {
  data: TreeNode[] = [
    {
      label: 'Le',
      type: 'person',
      expanded: true,
      data: {
          name: 'Lê Văn Lê',
          title: 'Senior Engineer',
          image: '/Le.jpg'
      },
      children: [
        {
          label: 'Hao',
          type: 'person',
          expanded: true,
          data: {
              name: 'Dư Vĩ Hào',
              title: 'Senior Engineer',
              image: '/Hao.jpg'
          },
          children: [
            {
              label: 'Anh',
              type: 'person',
              data: {
                  name: 'Lê Hoàng Duy Anh',
                  title: 'Engineer',
                  image: '/Anh.jpg'
              },
            },
            {
              label: 'Huy',
              type: 'person',
              data: {
                  name: 'Nguyễn Ngọc Thanh Huy',
                  title: 'Senior Engineer',
                  image: '/Huy.jpg'
              },
            }
          ]
        },
        {
          label: 'Linh',
          expanded: true,
          type: 'person',
          data: {
              name: 'Huỳnh Công Linh',
              title: 'Senior Engineer',
              image: '/Linh.jpg'
          },
          children: [
            {
              label: 'Minh',
              type: 'person',
              data: {
                  name: 'Trần Ngọc Minh',
                  title: 'Senior Engineer',
                  image: '/Minh.jpg'
              },
            },
            {
              label: 'Thai',
              type: 'person',
              data: {
                  name: 'Nguyễn Vũ Thái',
                  title: 'Senior Engineer',
                  image: '/Thai.jpg'
              },
            }
          ]
        }
      ]
    },
    {
      label: 'An',
      type: 'person',
      expanded: true,
      data: {
          name: 'Nguyễn Trường An',
          title: 'Engineer',
          image: '/An.jpg'
      },
    }
  ];

  selectedNodes!: TreeNode[];
  // isEditMode: boolean = false;
  isMenuOpen: boolean = false;
  selectedMenuNode: TreeNode | null = null;
  // selectedNode: TreeNode | null = null;
  editName: string = '';
  editTitle: string = '';
  editImage: string = '';

  ngOnInit() {
    this.expandAll(this.data);
  }

  // expand org chart
  expandAll(nodes: TreeNode[]) {
    nodes.forEach(node => {
      node.expanded = true;
      if (node.children) {
        this.expandAll(node.children);
      }
    });
  }

  // Chọn node trên org chart:
  // - Nếu isUpdateMode = true: mở drawer để sửa thông tin node (name/title/image)
  // - Nếu isUpdateMode = false: chỉ lưu node đang được chọn để thao tác (thêm/xóa/...)
  onNodeSelect(event: any, isUpdateMode: boolean) {
    if (isUpdateMode) {
      this.selectedMenuNode = event.node;
      this.editName = this.selectedMenuNode?.data?.name || '';
      this.editTitle = this.selectedMenuNode?.data?.title || '';
      this.editImage = this.selectedMenuNode?.data?.image || '';
      this.isMenuOpen = true;
    } else {
      this.selectedMenuNode = event.node;
    }
  }
  // Bỏ chọn node hiện tại
  onNodeUnselect() {
    this.selectedMenuNode = null;
  }

  // Đóng drawer chỉnh sửa và reset trạng thái chọn/chỉnh sửa tạm thời
  onDrawerHide() {
    // 1. Xóa sạch các nút đang được chọn (tô xanh) trên sơ đồ Org Chart
    this.selectedNodes = [];
    
    // 2. Reset luôn biến node đang xử lý về null để an toàn bộ nhớ
    this.selectedMenuNode = null;
    this.editImage = '';
  }

  // Thêm nhân sự con vào node đang chọn
  addMember() {
    if (!this.selectedMenuNode) {
      alert('choose node before add!');
      return;
    }
    if (this.selectedMenuNode) {
      if (!this.selectedMenuNode.children) {
        this.selectedMenuNode.children = [];
      }
      this.selectedMenuNode.children.push({
        label: `member_${Date.now()}`,
        expanded: true,
        type: 'person',
        data: { image: '/none_person.png', name: 'Staff', title: 'Staff' },
        children: []
      });
      this.selectedMenuNode.expanded = true;
      this.data = [...this.data];
      this.selectedMenuNode = null;
    }
  }

  // Xóa nhân sự đang chọn khỏi org chart
  deleteMember() {
    if (!this.selectedMenuNode) {
      alert('Vui lòng chọn 1 vị trí trên cây trước khi xóa!');
      return;
    }
    const updatedTree = this.filterNodeFromTree(this.data, this.selectedMenuNode);
    this.selectedMenuNode = null;
    this.data = updatedTree;
  }

  // Lưu thông tin chỉnh sửa nhân sự từ drawer bên phải
  updateMember() {
    if (this.selectedMenuNode) {
      this.selectedMenuNode.data.name = this.editName;
      this.selectedMenuNode.data.title = this.editTitle;
      this.selectedMenuNode.data.image = this.editImage;
      this.selectedMenuNode.expanded = true;
      this.data = [...this.data];
      this.selectedMenuNode = null;
      this.isMenuOpen = false;
    }
  }

  // Upload ảnh khi chỉnh sửa nhân sự:
  // - Kiểm tra đúng định dạng ảnh
  // - Chuyển ảnh sang Base64 để hiển thị/lưu tạm vào editImage
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Kiểm tra định dạng file phải là ảnh
      if (!file.type.match('image.*')) {
        alert('Vui lòng chỉ chọn file hình ảnh!');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        // e.target.result chính là chuỗi Base64 của hình ảnh
        this.editImage = e.target.result; 
      };
      reader.readAsDataURL(file); // Bắt đầu đọc file dữ liệu
    }
  }

  // filter to remove selected member from data
  private filterNodeFromTree(nodes: TreeNode[], targetNode: TreeNode): TreeNode[] {
    if (!nodes) return [];

    return nodes
      .filter(node => {
        // Điều kiện lọc: Loại bỏ node nếu trùng tham chiếu hoặc trùng nhãn + dữ liệu
        const isTarget = node === targetNode || 
                        (node.label === targetNode.label && JSON.stringify(node.data) === JSON.stringify(targetNode.data));
        return !isTarget; // Chỉ giữ lại các node KHÔNG PHẢI là targetNode
      })
      .map(node => {
        // Nếu node có con, tiếp tục đệ quy lọc danh sách con của nó
        if (node.children && node.children.length > 0) {
          return {
            ...node,
            children: this.filterNodeFromTree(node.children, targetNode)
          };
        }
        return node;
      });
  }

  // move selected member before the previous member
  moveUp(event: any) {
    this.moveNodeDirection('up');
  }

  // move selected member after the next member
  moveDown(event: any) {
    this.moveNodeDirection('down');
  }

  private moveNodeDirection(direction: 'up' | 'down') {
    if (!this.selectedMenuNode) {
      alert('Vui lòng chọn 1 thành viên để dịch chuyển!');
      return;
    }

    // 1. Create new data with new position of selected member
    const updatedTree = this.reorderTree(this.data, this.selectedMenuNode, direction);

    if (updatedTree) {
      // 2. Lưu lại node đang chọn để khôi phục tiêu điểm tô xanh
      const currentSelected = this.selectedMenuNode;
      
      // 3. Giải phóng tiêu điểm tạm thời
      this.selectedMenuNode = null;

      // 4. Gán cây mới tinh vào data -> Ép p-tree bắt buộc phải render lại thứ tự mới
      this.data = updatedTree;

      // 5. Khôi phục lại tiêu điểm chọn ngay sau đó
      setTimeout(() => {
        this.selectedMenuNode = currentSelected;
      }, 0);
    }
  }

  // Hàm đệ quy tạo cây mới và đảo vị trí phần tử (Không can thiệp mảng cũ)
  private reorderTree(nodes: TreeNode[], targetNode: TreeNode, direction: 'up' | 'down'): TreeNode[] | null {
    if (!nodes) return null;

    // Bước 1: Tìm xem node cần dịch chuyển có nằm ở cấp này không
    const index = nodes.findIndex(node => node === targetNode || (node.label === targetNode.label && node.type === targetNode.type));

    if (index > -1) {
      const newIndex = direction === 'up' ? index - 1 : index + 1;

      if (newIndex < 0 || newIndex >= nodes.length) {
        alert(direction === 'up' ? 'Thành viên này đã ở vị trí đầu tiên!' : 'Thành viên này đã ở vị trí cuối cùng!');
        return null;
      }

      // Tạo mảng mới tinh sao chép từ mảng cấp này
      const newNodes = [...nodes];
      // Hoán đổi vị trí trên mảng mới
      const temp = newNodes[index];
      newNodes[index] = newNodes[newIndex];
      newNodes[newIndex] = temp;

      return newNodes;
    }

    // Bước 2: Duyệt sâu vào các nhánh con và tạo cấu trúc cây mới sâu xuống dưới
    let childMoved = false;
    const updatedNodes = nodes.map(node => {
      if (node.children && node.children.length > 0) {
        const newChildren = this.reorderTree(node.children, targetNode, direction);
        if (newChildren) {
          childMoved = true;
          return {
            ...node,
            children: newChildren // Gán mảng children mới tinh đã được đổi chỗ con
          };
        }
      }
      return node;
    });

    return childMoved ? updatedNodes : null;
  }

  // move selected member to children level
  demoteNode() {
    if (!this.selectedMenuNode) return;

    const currentSelected = this.selectedMenuNode;
    this.selectedMenuNode = null;

    // Gọi hàm xử lý cấu trúc mới
    const isSuccess = this.flattenNodeDown(null, this.data, currentSelected);

    if (isSuccess) {
      this.data = this.data.map(rootNode => ({ ...rootNode }));
    }
    
    setTimeout(() => { this.selectedMenuNode = currentSelected; }, 0);
  }

  // move selected member to children level
  private flattenNodeDown(parent: TreeNode | null, currentLevelNodes: TreeNode[], target: TreeNode): boolean {
    if (!currentLevelNodes) return false;

    const index = currentLevelNodes.findIndex(n => n === target || (n.label === target.label && n.type === target.type));

    if (index > -1) {
      // Để đẩy Hào xuống cùng cấp với con và nhận Cha của Hào làm cha chung, bắt buộc Hào phải có Cha (parent)
      if (!parent) {
        alert('Thành viên này ở cấp cao nhất, không thể đẩy xuống cùng cấp với con dưới quyền của cấp trên!');
        return false;
      }

      // Lấy danh sách con hiện tại của Hào (Anh, Huy)
      const targetChildren = target.children || [];

      // 1. Đưa toàn bộ con của Hào ra mảng của Cha (Lê) trước
      if (targetChildren.length > 0) {
        parent.children?.push(...targetChildren);
      }

      // 2. Xóa mảng con của Hào đi (vì các con đã thoát ly ra cùng cấp rồi)
      target.children = [];

      // 3. Lúc này Hào vẫn đang nằm ở vị trí cũ trong mảng của Lê, các con thì vừa được push vào đuôi mảng.
      // Nếu bạn muốn Hào đứng đầu hoặc đứng chung hàng thì cấu trúc mảng parent.children bây giờ 
      // đã bao gồm cả Lê Hoàng Duy Anh, Nguyễn Ngọc Thanh Huy và Dư Vĩ Hào dưới trướng của Lê Văn Lê.
      
      return true;
    }

    // Duyệt đệ quy sâu vào các nhánh để tìm target
    for (const node of currentLevelNodes) {
      if (node.children && this.flattenNodeDown(node, node.children, target)) {
        node.children = [...node.children];
        return true;
      }
    }
    return false;
  }

  // move selected member to parent level
  promoteNode() {
    if (!this.selectedMenuNode) return;

    const currentSelected = this.selectedMenuNode;
    this.selectedMenuNode = null;

    // Thực hiện tìm kiếm và đẩy ra ngoài
    const isSuccess = this.outdentNode(null, this.data, currentSelected);

    if (isSuccess) {
      currentSelected.expanded = true;
      this.data = this.data.map(rootNode => ({ ...rootNode }));
    }

    setTimeout(() => { this.selectedMenuNode = currentSelected; }, 50);
  }

  // move selected member to parent level
  private outdentNode(parent: TreeNode | null, currentLevelNodes: TreeNode[], target: TreeNode): boolean {
    if (!currentLevelNodes) return false;

    const index = currentLevelNodes.findIndex(n => n === target || (n.label === target.label && n.type === target.type));

    if (index > -1) {
      // Nếu không có parent tức là node đang ở cấp cao nhất (gốc cây), không thể ra ngoài được nữa
      if (!parent) {
        alert('Thành viên này đã ở cấp cao nhất của sơ đồ!');
        return false;
      }

      // Bốc target ra khỏi mảng con hiện tại
      currentLevelNodes.splice(index, 1);

      // Tìm vị trí của chính Node Cha trong cây dữ liệu tổng để nhét target đứng ngay sau Cha
      this.insertAfterParent(this.data, parent, target);
      return true;
    }

    for (const node of currentLevelNodes) {
      if (node.children && this.outdentNode(node, node.children, target)) {
        node.children = [...node.children];
        return true;
      }
    }
    return false;
  }

  // move selected member to parent level
  // Find parent node to place after parent node
  private insertAfterParent(upperLevelNodes: TreeNode[], parentNode: TreeNode, nodeToInsert: TreeNode): boolean {
    const parentIndex = upperLevelNodes.findIndex(n => n === parentNode || (n.label === parentNode.label && n.type === parentNode.type));

    if (parentIndex > -1) {
      // Thêm node vào ngay sau vị trí của Node Cha
      upperLevelNodes.splice(parentIndex + 1, 0, nodeToInsert);
      return true;
    }

    for (const node of upperLevelNodes) {
      if (node.children && this.insertAfterParent(node.children, parentNode, nodeToInsert)) {
        node.children = [...node.children];
        return true;
      }
    }
    return false;
  }

  // save ort chart with new data(implement call api)
  saveOrgChart() {
    console.log(this.data)
  }
}
