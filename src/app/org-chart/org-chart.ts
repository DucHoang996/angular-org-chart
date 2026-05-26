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
  }
  ];

  selectedNodes!: TreeNode[];
  isEditMode: boolean = false;
  isMenuOpen: boolean = false;
  selectedMenuNode: TreeNode | null = null;
  selectedNode: TreeNode | null = null;
  editName: string = '';
  editTitle: string = '';
  editImage: string = '';

  ngOnInit() {
    this.expandAll(this.data);
  }

  expandAll(nodes: TreeNode[]) {
    nodes.forEach(node => {
      node.expanded = true;
      if (node.children) {
        this.expandAll(node.children);
      }
    });
  }

  // Mark Selected
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
  // Mark Unselected
  onNodeUnselect() {
    this.selectedMenuNode = null;
  }

  // Hide menu update
  onDrawerHide() {
    // 1. Xóa sạch các nút đang được chọn (tô xanh) trên sơ đồ Org Chart
    this.selectedNodes = [];
    
    // 2. Reset luôn biến node đang xử lý về null để an toàn bộ nhớ
    this.selectedMenuNode = null;
    this.editImage = '';
  }

  // Add new member to org chart
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

  deleteMember() {
    if (!this.selectedMenuNode) {
      alert('Vui lòng chọn 1 vị trí trên cây trước khi xóa!');
      return;
    }
    const updatedTree = this.filterNodeFromTree(this.data, this.selectedMenuNode);
    this.selectedMenuNode = null;
    this.data = updatedTree;
  }

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

  // Choose image for menu update
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

  moveUp(event: any) {
    if (this.selectedMenuNode) {
      this.moveNodeDirection('up');
      this.selectedMenuNode.expanded = true;
      this.data = [...this.data]
      // this.selectedMenuNode = null;
    }
  }

  // Nút bấm di chuyển xuống (▼) gọi hàm này
  moveDown(event: any) {
    if (this.selectedMenuNode) {
      this.moveNodeDirection('down');
      this.selectedMenuNode.expanded = true;
      this.data = [...this.data]
      // this.selectedMenuNode = null;
    }

  }

  // Hàm điều hướng chung
  private moveNodeDirection(direction: 'up' | 'down') {
    if (!this.selectedMenuNode) {
      alert('Vui lòng chọn 1 thành viên để dịch chuyển!');
      return;
    }

    // Gọi 1 hàm đệ quy duy nhất xử lý cho cả 2 chiều
    const isMoved = this.moveNodeInTree(this.data, this.selectedMenuNode, direction);

    if (isMoved) {
      this.data = [...this.data]; // Refresh lại giao diện cây
    }
  }

  // HÀM GỘP ĐỆ QUY DUY NHẤT
  private moveNodeInTree(nodes: TreeNode[], targetNode: TreeNode, direction: 'up' | 'down'): boolean {
    if (!nodes) return false;

    // 1. Tìm vị trí của node hiện tại trong mảng cấp này
    const index = nodes.findIndex(node => node === targetNode || (node.label === targetNode.label && node.type === targetNode.type));

    if (index > -1) {
      // Tính toán vị trí mới dựa vào hướng truyền vào
      const newIndex = direction === 'up' ? index - 1 : index + 1;

      // Kiểm tra nếu vượt quá biên (Đầu mảng khi lên hoặc cuối mảng khi xuống)
      if (newIndex < 0 || newIndex >= nodes.length) {
        alert(direction === 'up' ? 'Thành viên này đã ở vị trí đầu tiên!' : 'Thành viên này đã ở vị trí cuối cùng!');
        return false;
      }

      // Tiến hành hoán đổi vị trí (Swap)
      const temp = nodes[index];
      nodes[index] = nodes[newIndex];
      nodes[newIndex] = temp;

      return true;
    }

    // 2. Nếu không thấy ở cấp này, tiếp tục đệ quy xuống các nhánh con children
    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        const moved = this.moveNodeInTree(node.children, targetNode, direction);
        if (moved) {
          node.children = [...node.children]; // Cập nhật tham chiếu mảng con
          return true;
        }
      }
    }

    return false;
  }
}
